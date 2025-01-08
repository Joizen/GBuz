import { Component,Input,EventEmitter, Output, OnInit    } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';
import { CompanyModel,RouteModel,GpslogModel, SelecteddataModel,} from '../../../models/datamodule.module'
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-editable';
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

  private map: L.Map | undefined;
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


  async ngOnInit() {
    // this.settest();
    console.log("this.routedata ; ",this.routedata );
    this.routepolygondata = await this.getpolygon();
    this.listvehicle = await this.getvehecledll();
    if(this.listvehicle.length>0) {this.selectedvehicle = this.listvehicle[0];}
    this.initMap();    
    this.show.spinner = false;
  }
  settest(){
    this.routedata=new RouteModel();
    this.routedata.id = 117 ;
    this.routedata.routename = "บ้านเชิด" ;
    this.company = new CompanyModel();
    this.company.id  = 7 ;
    this.company.companyname ="บริษัท สยาม เอ็นดีเค จำกัด";
    this.company.lat = 13.110069;
    this.company.lng = 101.00327;
    this.company.complogo ="data:image/png;base64,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";

    
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
      var params = { routeid: this.routedata?.id  ,isone:true};
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log('getpolygon jsondata : ', jsondata);
      if (jsondata.code == '000') {
          result= this.data2latlngarray(jsondata.data.polygon)
          if(result.length>4){ this.show.deleteroute=true;}
        // console.log('getpolygon result : ', result);
      } else {
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
      const geoJsonData = this.latLngToGeoJSON(this.routepolygondata);
      this.routepolygonLayer = L.geoJSON(geoJsonData, {
        style: { color: 'blue',fillColor: "green",fillOpacity: 0.3,  weight: 2, },
      }).addTo(this.map);
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
          // this.modal.
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
      var confirm =await this.OkCancelMessage("ยืนยันการลบ",msg);
      if(confirm){
        const geoJsonData = this.routepolygonLayer.toGeoJSON();
        const JsonPolygon = this.geoJsonToWkt(geoJsonData);
        console.log("conver polygon wktPolygon :",JsonPolygon);
        if(await this.savepolygon(JsonPolygon)){
          // this.modal.
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
      // var wsname = "updatedata";
      // var param={tbname:"routepolygon",routeid:this.routedata?.id,polygon:polygon};
      var wsname = "updateroutedata";
      var param={routeid:this.routedata?.id,polygon:polygon};
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
      // var wsname = "deldata";
      // var param={tbname:"routepolygon",routeid:this.routedata?.id};
      var wsname = "deleteroutepolygon";
      var param={routeid:this.routedata?.id};
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
