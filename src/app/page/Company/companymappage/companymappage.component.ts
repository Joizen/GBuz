import { Component, OnInit, Input,EventEmitter, Output} from '@angular/core';
import { CompanyModel } from 'src/app/models/datamodule.module';
import { variable } from 'src/app/variable';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-editable';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogpageComponent,DialogConfig} from '../../../material/dialogpage/dialogpage.component';

@Component({
  selector: 'app-companymappage',
  templateUrl: './companymappage.component.html',
  styleUrls: ['./companymappage.component.scss']
})
export class CompanymappageComponent implements OnInit {
  @Input() modal: any;
  @Input() editcompany:CompanyModel = new CompanyModel();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();

  constructor(public va: variable,private dialog: MatDialog,private snacbar: MatSnackBar){ }
  public show={spinner:true};
  private map: L.Map | undefined;
  private drawnItems = new L.FeatureGroup();
  private companymarker: L.Marker|undefined;  // company point 
  private mapIconSize = 30;
  public editposition = {lat:0,lng:0};


  async ngOnInit() {
    console.log("editcompany : ",this.editcompany);
    this.initMap();
    this.editposition={lat:this.editcompany.lat,lng:this.editcompany.lng};
    this.editcompany.polygon = await this.getcomppolygon();
    var polygondata = await this.data2latlngarray(this.editcompany.polygon);
    console.log("polygondata : ",polygondata);
    this.createPolygon(polygondata);
    this.show.spinner = false;
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
      // this.createPolygon();
      return true;
    } catch (ex) {
      console.log('initMap error : ', ex);
    }
    return false;
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
        this.companymarker =L.marker([this.editcompany.lat, this.editcompany.lng],{ icon: customIcon, draggable: true }).addTo(this.map);
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
        this.companymarker.bindPopup(this.editcompany.companyname);
        this.companymarker.on('dragend', (event) => {
          const newLatLng = event.target.getLatLng();
          this.editposition = {lat:newLatLng.lat,lng:newLatLng.lng};
          console.log('New marker position:', this.editposition );
        });
      }else{
        // update startmarker
        this.companymarker.setLatLng([this.editcompany.lat, this.editcompany.lng]);
      }
      this.map.panTo(new L.LatLng(this.editcompany.lat, this.editcompany.lng));

    }
  }

  async getcomppolygon() {
    try{
      var wsname = 'getroutedata';
      var params = { routeid: this.editcompany.id ,type:0 ,isone:true};
      // var params = { routeid: 171 ,type:1 ,isone:true};
      var jsondata = await this.va.getwsdata(wsname, params);
      console.log('getpolygon jsondata : ', jsondata);
      if (jsondata.code == '000') {
        return jsondata.data.polygon;
      } else {
        return "";
        this.showSanckbar("getcomppolygon No data",2);
      }
      // console.log('getPlandayData result : ', result);
    } catch(ex){console.log("getcomppolygon error : ",ex)}
    return "";
  }

  createPolygon(latLngArray: L.LatLng[]): L.Polygon {
    // Create a polygon from the given LatLng array
    if(this.map){
      const polygon = L.polygon(latLngArray, {
        color: 'blue', // Border color
        fillColor: '#3388ff', // Fill color
        fillOpacity: 0.1, // Fill opacity
      });
      // Add the polygon to the map (if you want to immediately show it on a map)
      polygon.addTo(this.map);
      this.drawnItems.addLayer(polygon);
      this.initDrawControl();
      this.map.fitBounds(polygon.getBounds());
      return polygon;  
    }else{
      return new L.Polygon([]);
    }
  }

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
      if(this.map){
        this.map.addControl(drawControl);
        this.map.on(L.Draw.Event.EDITED, (event: any) => {
          const layers = event.layers;  // Get the layers that were edited
          layers.eachLayer((layer: L.Layer) => {
            console.log('Edited Marker layer:', layer);
            if (layer instanceof L.Polygon) {
              const updatedCoordinates = layer.getLatLngs();  // Get updated coordinates
              console.log('Updated Polygon Coordinates:', updatedCoordinates);
              if (Array.isArray(updatedCoordinates[0])) {
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
  
  async data2latlngarray(data:string) :Promise<L.LatLng[]> {
    const result: L.LatLng[]=[];
    var gap = 0.005;
    if(data != ""){ 
      const coordinates = data.replace("POLYGON((", "").replace("))", "").split(",");
      const latLngArray = coordinates.map(coord => {
        const [lng, lat] = coord.trim().split(" ").map(Number);
        return L.latLng(lat, lng);
      });
      return latLngArray;
    }else{
      result.push(L.latLng(this.editcompany.lat+gap, this.editcompany.lng-gap))
      result.push(L.latLng(this.editcompany.lat+gap, this.editcompany.lng+gap))
      result.push(L.latLng(this.editcompany.lat-gap, this.editcompany.lng+gap))
      result.push(L.latLng(this.editcompany.lat-gap, this.editcompany.lng-gap))
      result.push(L.latLng(this.editcompany.lat+gap, this.editcompany.lng-gap))
      return result;      
    }
  }

  public geoPolyToWkt(polygon:any): string {
    if (polygon.length > 0) {
      var result = "";
      if(polygon[0].lat != polygon[polygon.length-1].lat || polygon[0].lng != polygon[polygon.length-1].lng){
        polygon.push(polygon[0]);
      }
      polygon.forEach((points:any) => {
        result +=((result==""?"":",")+ points.lng + " " + points.lat) ;
      });
      return `POLYGON((${result}))`;
    }
    return "";
  }

  async updateroute(JsonPolygon:string){
    var msg= "คุณต้องการบันทึกพื้นที่นี้ หรือไม่";
    var confirm =await this.OkCancelMessage("ยืนยันการบันทึก",msg);
    if(confirm){
      if(await this.savepolygon(JsonPolygon)){
        this.editcompany.polygon = JsonPolygon;
        this.talk.emit(this.editcompany);
        this.modal.close();
      }
    }
  } 
  async deleteroute(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการลบ","คุณต้องการลบข้อมูลพื้นที่นี้หรือไม่");
      if(confirm=="true"){
        if(await this.deletepolygon()){
            this.alertMessage("แจ้งเตือน", "ลบข้อมูลข้อมูลพื้นที่นี้เรียบร้อยแล้ว");
            this.editcompany.polygon = "";
            this.talk.emit(this.editcompany);
            this.modal.close();
          }else{
          this.alertMessage("แจ้งเตือน", "ลบข้อมูลข้อมูลพื้นที่นี้ผิดพลาดโปรดลองอีกครัง");
          this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง");
        }
      }
    }catch(ex){
      console.log("deleteshift error ",ex)
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }

  }

  async savepolygon(polygon:string){
    try{
      var wsname = "updateroutedata";
      var param={routeid:this.editcompany.id,polygon:polygon,type:0};
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
      var param={routeid:this.editcompany.id,type:0};
      var jsondata = await this.va.getwsdata(wsname,param)
      if(jsondata.code=="000"){
        this.showSanckbar("delete polygon success",2);
        return true;
      }
    }catch(ex){
      console.log("delete polygon  Error : ",ex)
      this.showSanckbar("delete polygon   error" + ex,2);
    }
    return false;
  }
  async saveposition(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลตำแหน่งนี้หรือไม่");
      if(confirm=="true"){
        if(await this.savedupdatecompany()){
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลตำแหน่งนี้เรียบร้อยแล้ว");
            this.talk.emit(this.editcompany);
            this.modal.close();
        }else{
          this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลตำแหน่งนี้ผิดพลาดโปรดลองอีกครัง");
          this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
        }
      }
    }catch(ex){
      console.log("save company error ",ex)
      this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }

  async savedupdatecompany(){
    var lastlat=this.editcompany.lat;
    var lastlng=this.editcompany.lng;
  try{
      var tbname = "company" ;
      var wsname = "updatedata";
      this.editcompany.lat = this.editposition.lat;
      this.editcompany.lng = this.editposition.lng;
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,data:this.editcompany});
      if(jsondata.code=="000"){return true;}
    }catch(ex){
      console.log("saveupdate Company Error : ",ex);
      this.showSanckbar("save or update Company Position error" + ex,2);
    }
    this.editcompany.lat = lastlat;
    this.editcompany.lng = lastlng;
    return false;
  }

  
  // ==========================================================
  // #region ===== Message Dialog ====================

  alertMessage(header: string, message: string) {
    var dialogRef = this.dialog.open(DialogpageComponent, {
      data: new DialogConfig(header, message, false),
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log("Dialog result : ",result);
    });
  }

  OkCancelMessage(header: string, message: string): Promise<any> {
    try {
      var dialogRef = this.dialog.open(DialogpageComponent, {
        data: new DialogConfig(header, message, true),
      });
      return dialogRef.afterClosed().toPromise();
    } catch (ex) {
      console.log('OkCancelMessage error ', ex);
      return Promise.reject(ex); // If there's an error, reject the promise
    }
  }

  showSanckbar(message: string, duration = 5) {
    this.snacbar.open(message, 'Close', {
      duration: duration * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  // #endregion
  // ==========================================================

}
