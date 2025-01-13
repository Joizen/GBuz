import { Component,Input,EventEmitter, Output, OnInit    } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';
import { CompanyModel,RouteModel,GpslogModel, SelecteddataModel,} from '../../../models/datamodule.module'
import * as L from 'leaflet';
import 'leaflet-draw';

// import 'leaflet-editable';
import * as turf from '@turf/turf';

@Component({
  selector: 'app-routepolygonpage',
  templateUrl: './routepolygonpage.component.html',
  styleUrls: ['./routepolygonpage.component.scss']
})
export class RoutepolygonpageComponent implements OnInit {
  constructor(private modalService: NgbModal,public va: variable,private snacbar: MatSnackBar,private dialog:MatDialog){ }

  @Input() modal: any;
  @Input() company: CompanyModel = new CompanyModel();
  @Input() routedata : RouteModel | undefined;
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();

  private map: L.Map | undefined;
  private drawnItems = new L.FeatureGroup();
  private routepolyline!: L.Polyline;  // history route
  private selectpolyline!: L.Polyline; // filter history route for create polygon
  private routepolygonLayer: L.GeoJSON | null = null;  // polygon form selectpolyline
  private routepolygondata:L.LatLng[]=[]; // data of polygon for save
  private startmarker: L.Marker|undefined; // start point of routepolygonLayer
  private endmarker: L.Marker|undefined; // end point of routepolygonLayer
  private curentmarker: L.Marker|undefined; // end point of routepolygonLayer
  private companymarker: L.Marker|undefined;  // company point 
  private mapIconSize = 30;

  public show={spinner:true,routeformlog:true,saveroute:false,deleteroute:false,view:false,
                startdate: this.va.DateToString("yyyy-MM-dd",new Date) ,starttime:"00:00",endtime:"08:00",
                selectstart:new Date(),selectend:new Date(),
                setstartpoint:true,polygonstart:new Date("2024-01-01"),polygonend:new Date("2024-01-02")}
  listhistory:GpslogModel[]=[];
  listvehicle:SelecteddataModel[]=[];
  selectedvehicle:SelecteddataModel=new SelecteddataModel();
  isupdatedata=false;


  async ngOnInit() {
    console.log("this.routedata ; ",this.routedata );
    this.routepolygondata = await this.getpolygon();
    this.listvehicle = await this.getvehecledll();
    if(this.listvehicle.length>0) {this.selectedvehicle = this.listvehicle[0];}
    this.initMap();  
    this.show.spinner = false;
  }

  async getvehecledll() {
    var result: SelecteddataModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'listvehiclebyroute', routeid:this.routedata?.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log('searchgpslog jsondata : ', jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new SelecteddataModel(data);
        result.push(temp);
      });
      this.showSanckbar("getvehecledll success");
    } else {
      this.showSanckbar("getvehecledll No data");
    }
    return result;
  }


  async initMap() {
    try {
      // console.log('this.map : ', this.map);
      this.map = L.map('routemap', {
        center: [13.6140328, 100.6162229], // Latitude and longitude of the center point
        zoom: 13, // Initial zoom level
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
          }),
        ],
      });
      this.setcompanymarker();
      this.createPolygon();
      return true;
    } catch (ex) {
      console.log('initMap error : ', ex);
    }
    return false;
  }

  //=================================================================
  // #region  =========== SET Polygon  ==============================

  async getpolygon() {
    var result:L.LatLng[]=[];
    try{
      // var wsname = 'getdata';
      // var params = { tbname: 'routepolygon', routeid: this.routedata?.id  ,isone:true};
      var wsname = 'getroutedata';
      var params = { routeid: this.routedata?.id ,type:1 ,isone:true};
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log('getpolygon jsondata : ', jsondata);
      if (jsondata.code == '000') {
          result= this.data2latlngarray(jsondata.data.polygon)
          if(result.length>4){ this.show.deleteroute=true;}
          
        // console.log('getpolygon result : ', result);
      } else {
        // // Remove Draw Control
        // if(this.map){
        //   this.map.eachLayer((layer: any) => {
        //     if (layer instanceof L.Control.Draw) {
        //       if(this.map){this.map.removeControl(layer);} 
        //     }
        //   });
        // }  
        this.showSanckbar("getPlandayData No data",2);
      }
      // console.log('getPlandayData result : ', result);
    } catch(ex){console.log("getpolygon error : ",ex)}
    return result;
  }

  private data2latlngarray(data:string) {
    const coordinates = data
        .replace("POLYGON((", "") // Remove "POLYGON(("
        .replace("))", "")       // Remove "))"
        .split(",");             // Split into individual coordinate strings
    const latLngArray = coordinates.map(coord => {
        const [lng, lat] = coord.trim().split(" ").map(Number); // Split and parse as numbers
        return L.latLng(lat, lng); // Swap order to L.LatLng(lat, lng)
    });

    return latLngArray;
  }

  private createPolygon():void{
    if(this.map){
      // console.log("this.routepolygondata :",this.routepolygondata);
      const geoJsonData = this.latLngToGeoJSON(this.routepolygondata);
      // console.log("geoJsonData :",geoJsonData.geometry.coordinates[0]);
      this.routepolygonLayer = L.geoJSON(geoJsonData, {
        style: { color: 'blue',fillColor: "green",fillOpacity: 0.3,  weight: 2, },
      });
      // .addTo(this.map);
      // console.log("this.routepolygonLayer :",this.routepolygonLayer);
     
      if(geoJsonData.geometry.coordinates[0]){
        var data:L.LatLngExpression[]=[];
        geoJsonData.geometry.coordinates[0].forEach(point => {
          data.push([point[1],point[0]]);
        });
        console.log("data :",data);
        var routename = this.routedata?this.routedata.routename:"Unknow";
        const polygon = L.polygon(data, {
          color: 'blue',
          fillColor: 'lightblue',
          fillOpacity: 0.5
        }).bindPopup(routename);
        console.log("polygon :",polygon);
        this.drawnItems.addLayer(polygon);
        this.map.addLayer(this.drawnItems)
        this.initDrawControl();  
      }
      this.map.fitBounds(this.routepolygonLayer.getBounds());
    }
  }
  private latLngToGeoJSON(latlngs: L.LatLng[]): GeoJSON.Feature<GeoJSON.Polygon> {
    const coordinates = latlngs.map(latlng => [latlng.lng, latlng.lat]);
    coordinates.push([latlngs[0].lng, latlngs[0].lat]); // Close the polygon
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates],
      },
      properties: {},
    };
  }

  // #endregion  =========== SET Polygon  ===========================
  //=================================================================

  //==================================================================
  // #region  =========== Edit Polygon  ==============================
  private initDrawControl(): void {
    const drawControl = new L.Control.Draw({
      draw: {
        polygon:false,
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        // featureGroup: this.drawnItems, // Use the feature group for editing
        featureGroup: this.drawnItems, // Use the feature group for editing
        remove: false // Allow removing shapes
      }
    });
    if( this.map){
      this.map.addControl(drawControl);
      this.map.on(L.Draw.Event.EDITED, (event: any) => {
        const layers = event.layers;  // Get the layers that were edited
        layers.eachLayer((layer: L.Layer) => {
          if (layer instanceof L.Polygon) {
            const updatedCoordinates = layer.getLatLngs();  // Get updated coordinates
            console.log('Updated Polygon Coordinates:', updatedCoordinates);
            if (Array.isArray(updatedCoordinates[0])) {
              // this.savePolygon(updatedCoordinates[0]);
              console.log("save updatedCoordinates",updatedCoordinates);
              if (updatedCoordinates instanceof Array && updatedCoordinates[0] instanceof Array){
                var data = this.geoPolyToWkt(updatedCoordinates[0] );
                this.updateroute(data);
                console.log("save data",data);
                }
            }
          }
        });
      });
    }

  }
  
  public geoPolyToWkt(polygon:any): string {
      // console.log("polygon",polygon);
      // : any = [{LatLng:{lat: 13.14595,lng: 100.985208}}]
      if (polygon.length > 0) {
        var result = "";
          polygon.forEach((points:any) => {result +=((result==""?"":",")+ points.lng + " " + points.lat) ;
        });
        return `POLYGON((${result}))`;
      }
      return "";
  }

  async updateroute(JsonPolygon:string){
    if (this.routepolygonLayer) {
      var msg= "คุณต้องการบันทึกเส้นทางเดินรถนี้ หรือไม่";
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก",msg);
      if(confirm){
        // const geoJsonData = this.routepolygonLayer.toGeoJSON();
        // const JsonPolygon = this.geoJsonToWkt(geoJsonData);
        // console.log("conver polygon wktPolygon :",JsonPolygon);
        if(await this.savepolygon(JsonPolygon)){
          this.talk.emit(JsonPolygon);
          this.modal.close();
        }
      }

    }else{
      this.showSanckbar("No polygon data")
    }
  } 



  // #endregion  =========== Edit Polygon  ===========================
  //==================================================================


  //=================================================================
  // #region  =========== SET History  ==============================
  async searchgpslog(){
    this.show.spinner=true;
    this.selecttimechange();
    this.listhistory = await this.getgpslog();
    this.show.spinner=false;
  }
  async getgpslog() {
    var result: GpslogModel[] = [];
    try{
      var wsname = 'getrealtimedata';
      var params = { tbname: 'gpslog', gpsvid: this.selectedvehicle.ref1,starttime:this.show.selectstart,endtime:this.show.selectend};
      var listpoints:L.LatLng[]=[];
      var polylist:[number, number][]=[];
      var jsondata = await this.va.getwsdata(wsname, params);
      var firstpoint:GpslogModel|undefined = undefined;
      var lastpoint:GpslogModel|undefined = undefined;
      // console.log('searchgpslog jsondata : ', jsondata);
      if (jsondata.code == '000') {
        var i:number=0;
        jsondata.data.forEach((data: any) => {
          var temp = new GpslogModel(data);
          result.push(temp);
          if(temp.gpsstatus==31||temp.gpsstatus==33){
            i+=1
            if (!firstpoint){firstpoint=temp;}
            lastpoint=temp;
          }
          temp.ref=i;
          var point = new L.LatLng(temp.lat,temp.lng);
          listpoints.push(point);
          var polypoint:[number, number]=[temp.lng,temp.lat];
          polylist.push(polypoint);
        });
        if(this.map){
          this.routepolyline = L.polyline(listpoints,{color:'red'}).addTo(this.map);
          this.selectpolyline = L.polyline(listpoints,{color:'green'}).addTo(this.map);
          var showpoint =result.filter(x=>x.gpsstatus==31||x.gpsstatus==33);
          if(showpoint.length>0){
            showpoint.forEach(point=>{
              this.sethistorymarker(point);
              // if(this.map){
              //   var msg = this.va.DateToString("HH:mm",point.gpstime);
              //   // const marker =L.marker(point).addTo(this.map).bindPopup(msg);
              //   const marker =L.marker(point).addTo(this.map);
              //   marker.on('click', () => {
              //     this.setselectpoint(point);
              //   });
              // }            
            });
          }
          if(firstpoint){this.setmarkerstart(true,firstpoint);}      
          if(lastpoint){this.setmarkerstart(false,lastpoint);}   
          this.updatePolygon();   
        }
        this.show.saveroute=true;
      } else {
        this.showSanckbar("searchgpslog No data",2);
      }
      // console.log('getWeekData result : ', result);
   
    }catch(ex){console.log("getgpslog error :",ex)}
    return result;
  }
  public showrunpoint(startpoint:GpslogModel){
    var show =!startpoint.show;
    startpoint.show=show;
    var listshow = this.listhistory.filter(x=>x.ref==startpoint.ref);
    listshow.forEach(point => {
      point.show=show;
    });
    // console.log("listshow : ",listshow);
    // console.log("show : "+startpoint.ref,show);
  }
  public setselectpoint(point:GpslogModel){
    // console.log("setselectpoint point : ",point);
    
    if(!this.show.view){
      this.setmarkerstart(this.show.setstartpoint,point);
      this.clearcurentmarker();
    }
    else{this.setcurentmarker(point)}
  }
  public setstartpoint(event:boolean){
    this.show.view = false;
    this.clearcurentmarker();
    this.show.setstartpoint=event;
  }
  public setmarkerstart(startpoint:boolean,point:GpslogModel){
    if(this.map){
      var zoom = this.map.getZoom();
      if(startpoint){
        if (!this.startmarker){
          // new  startmarker
          const zoomLevel = zoom;
          const zl = zoomLevel?zoomLevel:13;
          const newSize = this.mapIconSize * (zl / 13); 
          const customIcon = L.divIcon({
            html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                    <img src="${this.va.icon.startpoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
            iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
          });    
          this.startmarker =L.marker([point.lat, point.lng],{ icon: customIcon }).addTo(this.map);
          const resizeMarkerIcon = () => {
            const zoomLevel = this.map?.getZoom();
            
            // Calculate new size based on zoom level (adjust the scaling factor as needed)
            const zl = zoomLevel?zoomLevel:13;
            const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level
          
            // Update the marker icon size
            this.startmarker?.setIcon(
              L.divIcon({
                html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                  <img src="${this.va.icon.startpoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                </div>`,
                className: '', // Remove default styling
                iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
              })
            );
          };
        }else{
          // update startmarker
          this.startmarker.setLatLng([point.lat, point.lng]);
        }
        this.show.polygonstart = new Date(point.gpstime);
      }
      else{
        if (!this.endmarker){
          // new  endmarker
          const zoomLevel = zoom;
          const zl = zoomLevel?zoomLevel:13;
          const newSize = this.mapIconSize * (zl / 13); 
          const customIcon = L.divIcon({
            html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                    <img src="${this.va.icon.finishpoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
            iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
          });    
          this.endmarker =L.marker([point.lat, point.lng],{ icon: customIcon }).addTo(this.map);
          const resizeMarkerIcon = () => {
            const zoomLevel = this.map?.getZoom();
            
            // Calculate new size based on zoom level (adjust the scaling factor as needed)
            const zl = zoomLevel?zoomLevel:13;
            const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level
          
            // Update the marker icon size
            this.endmarker?.setIcon(
              L.divIcon({
                html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                  <img src="${this.va.icon.finishpoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                </div>`,
                className: '', // Remove default styling
                iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
              })
            );
          };

        }else{
          // update endmarker
          this.endmarker.setLatLng([point.lat, point.lng]);
        }
        this.show.polygonend = new Date(point.gpstime);
      }
      var filterdata = this.listhistory.filter(x => 
        x.gpstime >= this.show.polygonstart && x.gpstime <= this.show.polygonend
      );
      // console.log("setmarkerstart filterdata : ",filterdata) 
      if(filterdata.length>0){
        var listpoints:L.LatLng[]=[];
        filterdata.forEach(log => {
          var point = new L.LatLng(log.lat,log.lng);
          listpoints.push(point);
        });
        // var station = new L.LatLng(this.company.lat,this.company.lng);
        // listpoints.push(station);
        if (this.selectpolyline) {
          this.selectpolyline.remove();

          // this.selectpolyline.setLatLngs(listpoints);
          this.selectpolyline = L.polyline(listpoints,{color:'green'}).addTo(this.map);
        }
        this.updatePolygon();
      }
    }

  }
  public clearcurentmarker(){
    if (this.curentmarker) {
      this.curentmarker.remove(); // Removes the marker from the map
      this.curentmarker = undefined;   // Optionally set it to null to clear the reference
    };
  }
  public setcurentmarker(point:GpslogModel){
    if(this.map){
      var zoom = this.map.getZoom();
      if (!this.curentmarker){
        // new  startmarker
        const zoomLevel = zoom;
        const zl = zoomLevel?zoomLevel:13;
        const newSize = this.mapIconSize * (zl / 13); 
        const customIcon = L.divIcon({
          html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                  <img src="${this.va.icon.thispoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                </div>`,
          className: '', // Remove default styling
          iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
          iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
        });    
        this.curentmarker =L.marker([point.lat, point.lng],{ icon: customIcon }).addTo(this.map);
        this.curentmarker.bindPopup(this.va.DateToString("HH:mm",point.gpstime));
        const resizeMarkerIcon = () => {
          const zoomLevel = this.map?.getZoom();
          
          // Calculate new size based on zoom level (adjust the scaling factor as needed)
          const zl = zoomLevel?zoomLevel:13;
          const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level
          // Update the marker icon size
          this.curentmarker?.setIcon(
            L.divIcon({
              html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                <img src="${this.va.icon.thispoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
              </div>`,
              className: '', // Remove default styling
              iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
            })
          );
        };
      }else{
        // update startmarker
        this.curentmarker.setLatLng([point.lat, point.lng]);
        const popup = this.curentmarker.getPopup();
        var msg =this.va.DateToString("HH:mm",point.gpstime)
        if(point.gpsstatus!=31&&point.gpsstatus!=33){msg += (" speed : " + point.speed)}
        if(popup){ popup.setContent(msg); }
        else{ this.curentmarker.bindPopup(msg);}
      }
      this.map.panTo([point.lat, point.lng]);
      if (this.curentmarker){this.curentmarker.openPopup();}
    }

  }
  
  public setcompanymarker(){
    if(this.map){
      var zoom = this.map.getZoom();
      if (!this.companymarker){
        // new  startmarker
        const zoomLevel = zoom;
        const zl = zoomLevel?zoomLevel:13;
        const newSize = this.mapIconSize * (zl / 13); 
        const customIcon = L.divIcon({
          html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                  <img src="${this.va.icon.company}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                </div>`,
          className: '', // Remove default styling
          iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
          iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
        });    
        this.companymarker =L.marker([this.company.lat, this.company.lng],{ icon: customIcon }).addTo(this.map);
        const resizeMarkerIcon = () => {
          const zoomLevel = this.map?.getZoom();
          
          // Calculate new size based on zoom level (adjust the scaling factor as needed)
          const zl = zoomLevel?zoomLevel:13;
          const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level
        
          // Update the marker icon size
          this.companymarker?.setIcon(
            L.divIcon({
              html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                <img src="${this.va.icon.company}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
              </div>`,
              className: '', // Remove default styling
              iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
            })
          );
        };
        this.companymarker.bindPopup(this.company.companyname);
      }else{
        // update startmarker
        this.companymarker.setLatLng([this.company.lat, this.company.lng]);
      }
      this.map.panTo(new L.LatLng(this.company.lat, this.company.lng));

    }
  }
  public sethistorymarker(point : GpslogModel ){
    if(this.map){
      var zoom = this.map.getZoom();
        // new  startmarker
        const zoomLevel = zoom;
        const zl = zoomLevel?zoomLevel:13;
        const newSize = this.mapIconSize * (zl / 26); 
        // const newSize = this.mapIconSize * (zl / 13); 
        var iconm = point.gpsstatus==31?this.va.icon.idle: this.va.icon.stop;
        const customIcon = L.divIcon({
          html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                  <img src="${iconm}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                </div>`,
          className: '', // Remove default styling
          iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
          iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
        });    
        var marker =L.marker([point.lat, point.lng],{ icon: customIcon }).addTo(this.map);
        const resizeMarkerIcon = () => {
          const zoomLevel = this.map?.getZoom();
          
          // Calculate new size based on zoom level (adjust the scaling factor as needed)
          const zl = zoomLevel?zoomLevel:13;
          const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level
        
          // Update the marker icon size
          marker.setIcon(
            L.divIcon({
              html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                <img src="${iconm}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
              </div>`,
              className: '', // Remove default styling
              iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
            })
          );
        };
        marker.bindPopup(this.va.DateToString("HH:mm",point.gpstime));
    }
  }
  public updatePolygon(): void {
    // Get the polyline's coordinates
    const polylineCoords = this.selectpolyline.getLatLngs() as L.LatLng[];

    // Convert to Turf.js LineString format
    const lineString = turf.lineString(polylineCoords.map(coord => [coord.lng, coord.lat]));

    // Create a buffer polygon (100 meters on each side)
    const buffer = turf.buffer(lineString, 0.1, { units: 'kilometers' });
    if(this.map){
      // Remove the existing polygon layer, if any
      if (this.routepolygonLayer) {
        this.map.removeLayer(this.routepolygonLayer);
      }
      // Add the new polygon layer to the map
      this.routepolygonLayer = L.geoJSON(buffer, { style: { color: 'blue', opacity: 0.5 } }).addTo(this.map);
      this.map.fitBounds(this.routepolygonLayer.getBounds());
     
    }

  }
  public selecttimechange(){
    const [shours, sminutes] = this.show.starttime.split(':').map(Number); 
    const [ehours, eminutes] = this.show.endtime.split(':').map(Number); 
    this.show.selectstart = new Date( this.show.startdate);
    this.show.selectstart.setHours(shours, sminutes);
    this.show.selectend = new Date( this.show.startdate);
    this.show.selectend.setHours(ehours, eminutes);
    if(this.show.selectend <=this.show.selectstart ){
      this.show.selectend.setDate(this.show.selectend.getDate()+1);
    }

    console.log("this.show.selectstart :",this.show.selectstart);
    console.log("this.show.selectend :",this.show.selectend);

  }
  public  clearroute(){
    if (this.selectpolyline) {this.selectpolyline.remove(); }
    if (this.routepolygonLayer) {this.routepolygonLayer.remove(); }
  }

  // #endregion  =========== SET History  =============================
  //===================================================================


 async deleteroute(){
    if (this.routepolygonLayer) {
      var msg= "คุณต้องการลบเส้นทางเดินรถนี้ หรือไม่";
      var confirm =await this.OkCancelMessage("ยืนยันการลบ",msg);
      if(confirm){        
        if(await this.deletepolygon()){
          this.talk.emit("");
          this.modal.close();
          this.routepolygondata = await this.getpolygon();
        }
      }

    }else{
      this.showSanckbar("No polygon data")
    }
  }
  async saveroute(){
    if (this.routepolygonLayer) {
      var msg= "คุณต้องการบันทึกเส้นทางเดินรถนี้ หรือไม่";
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก",msg);
      if(confirm){
        const geoJsonData = this.routepolygonLayer.toGeoJSON();
        const JsonPolygon = this.geoJsonToWkt(geoJsonData);
        // console.log("conver polygon wktPolygon :",JsonPolygon);
        if(await this.savepolygon(JsonPolygon)){
          this.talk.emit(JsonPolygon);
          this.modal.close();
        }
      }

    }else{
      this.showSanckbar("No polygon data")
    }
  } 
  public geoJsonToWkt(geoJson: any): string {
    const coordinates = geoJson.features[0].geometry.coordinates[0]; // Assuming it's a single polygon
    // console.log("geoJsonToWkt coordinates :",coordinates);
    const wkt = `POLYGON((${coordinates
      .map((coord: [number, number]) => `${coord[0]} ${coord[1]}`) // lng lat format
      .join(', ')}))`;
    return wkt;
  }


  async savepolygon(polygon:string){
    try{
      var wsname = "updateroutedata";
      var param={routeid:this.routedata?.id,polygon:polygon,type:1};
      var jsondata = await this.va.getwsdata(wsname,param)
      if(jsondata.code=="000"){
        this.showSanckbar("save polygon success",2);
        return true;
      }
    }catch(ex){
      console.log("save polygon  Error : ",ex)
      this.showSanckbar("save polygon   error" + ex,2);
    }
    return false;
  }
  async deletepolygon(){
    try{
      var wsname = "deleteroutepolygon";
      var param={routeid:this.routedata?.id,type:1};
      var jsondata = await this.va.getwsdata(wsname,param)
      if(jsondata.code=="000"){
        this.showSanckbar("delete polygon success",2);
        return true;
      }
    }catch(ex){
      console.log("save polygon  Error : ",ex)
      this.showSanckbar("delete polygon   error" + ex,2);
    }
    return false;
  }

  //===================================================================
  // #region  =========== Message Dialog ==============================

  public alertMessage(header: string, message: string) {
    var dialogRef = this.dialog.open(DialogpageComponent,
      { data: new DialogConfig(header, message, false) }
    );
    dialogRef.afterClosed().subscribe(result => {
      // console.log("Dialog result : ",result);
    });
  }

  public OkCancelMessage(header: string, message: string): Promise<any>{
    try{
      var dialogRef = this.dialog.open(DialogpageComponent,
        { data: new DialogConfig(header, message, true) }
      );
      return dialogRef.afterClosed().toPromise();
    }catch(ex){
      console.log("OkCancelMessage error ",ex)
      return Promise.reject(ex); // If there's an error, reject the promise
    }
  }

  public showSanckbar(message: string, duration = 5) {
    this.snacbar.open(message, 'Close',
      { duration: (duration * 1000), horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  // #endregion  =========== Message Dialog ===========================
  //===================================================================

}
