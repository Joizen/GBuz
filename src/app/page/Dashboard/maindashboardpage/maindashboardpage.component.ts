import { Component,EventEmitter,Output,OnInit  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { DashboardcompanyModel, DashboardplanModel, PlanactivityModel, ProfileModel } from 'src/app/models/datamodule.module';
import * as L from 'leaflet';
import mqtt, { MqttClient } from 'mqtt';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-maindashboardpage',
  templateUrl: './maindashboardpage.component.html',
  styleUrls: ['./maindashboardpage.component.scss']
})
export class MaindashboardpageComponent implements OnInit {
  constructor( private modalService: NgbModal, public va: variable, private dialog: MatDialog,private router: Router, private snacbar: MatSnackBar) {}
  show = { Refreshpage: false, Spinner: false, Profile: false,  Driverwork: false,type:2  };

  public UserProfile:ProfileModel =new ProfileModel();
  public listcompany:DashboardcompanyModel[]=[];  
  public listdo:DashboardplanModel[]=[];
  public listactivity:PlanactivityModel[]=[];
  public activecompany:DashboardcompanyModel|undefined;
  public activeplan:DashboardplanModel|undefined;

  private map: L.Map | undefined;
  private mapIconSize = 30;
  private vmarkers: { id: number, marker: L.Marker }[] = [];
  private cmarkers: L.Marker| undefined;

  public mqttClient: any;
  public lastplantime: Date = this.va.defultdate;

  
  async ngOnInit() {
    if( await this.checktoken()){
      if(this.va.UserProfile){this.UserProfile =this.va.UserProfile;}
      // console.log("this.va.UserProfile",this.va.UserProfile)
      this.initMap();
      this.mqttClient = await this.connectMqtt();
      this.subscribeMqtt(this.mqttClient, 'gbdupdate');
      this.subscribeMqtt(this.mqttClient, 'gbusvupdate');
      this.subscribeMqtt(this.mqttClient, 'gbdplanupdate');
      await this.setdashboarddata();    
    }
  }
  async checktoken(){
    this.va.token = this.va.gettoken();
    if(!this.va.token || this.va.token==""){ this.router.navigate(["login"]); return false;} 
    else{ await this.va.getprofile(); return true;}
  }

  //===================================================================
  // #region  =========== Move Left & right ===========================
    leftWidth: number = 50; // Start with left side at 50%
    isDragging: boolean = false;
 
    startDragging(event: MouseEvent) {
      this.isDragging = true;
      document.body.style.cursor = 'ew-resize';
    }
    stopDragging() {
      this.isDragging = false;
      document.body.style.cursor = 'default';
    }
    onMouseMove(event: MouseEvent) {
      if (!this.isDragging) return;
  
      const containerWidth = window.innerWidth;
      const leftWidth = (event.clientX / containerWidth) * 100;
      const rightWidth =  100 -leftWidth;
      this.leftWidth = leftWidth ;
      // Trigger a resize on the map to update its dimensions
      setTimeout(() => {
       this.map?.invalidateSize();
      }, 0);
    }
   // #endregion =========== Move Left & right ========================
  //===================================================================
  
  //===================================================================
  // #region  =========== Set Dash board Data =========================

  async setdashboarddata(){    
    this.listcompany = await this.getlistcompany();
    if(this.listcompany.length>0){
      var lasttime = new Date(this.lastplantime);
      this.listdo = await this.getlistdriverplan();    
      if(this.listdo.length>0){
        this.listactivity = await this.getactivityplan(lasttime);
        await this.setdashboardcompany()
        await this.plotvehecle();
        this.show.Spinner=false;
      }      
    }
  }
  async getlistcompany(){
    var result:DashboardcompanyModel[]=[];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'company'};
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("getlistcompany jsondata :",jsondata);
      if (jsondata.code == '000' && jsondata.data.length>0){
        jsondata.data.forEach((data:any)=>{
          var temp = new DashboardcompanyModel(data);
          result.push(temp);
        });    
      }
    }catch(ex){console.log("getlistcompany error :",ex)}
    // console.log("getlistcompany result :",result);
    return result;
  }
  async getlistdriverplan(){
    var result:DashboardplanModel[]=[];
    try{
      var wsname = 'getdata';
      // var testtime=new Date( this.lastplantime) ;
      // testtime.setHours(testtime.getHours()-1);
      // var params = { tbname: 'driverdashboard',lasttime:testtime};
      var params = { tbname: 'driverdashboard',lasttime:this.lastplantime};
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("getactivedriverplan jsondata :",jsondata);
      if (jsondata.code == '000' && jsondata.data.length>0){
        jsondata.data.forEach((data:any)=>{
          var temp = new DashboardplanModel(data);
          if(temp.modifieddate>this.lastplantime){this.lastplantime=temp.modifieddate;}
          result.push(temp);
        });    
      }
    }catch(ex){console.log("getactivedriverplan error :",ex)}
    // console.log("getactivedriverplan result :",result);
    return result;
  }
  async getactivityplan(lasttime:Date){
    var result:PlanactivityModel[]=[];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'activityplan',lasttime:lasttime};
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("getactivedriverplan jsondata :",jsondata);
      if (jsondata.code == '000' && jsondata.data.length>0){
        jsondata.data.forEach((data:any)=>{
          var temp = new PlanactivityModel();
          temp.setdata(data);
          result.push(temp);
        });    
      }
    }catch(ex){console.log("getactivedriverplan error :",ex)}
    // console.log("getactivedriverplan result :",result);
    return result;
  }
  async setdashboardcompany(){ 
    if(this.listdo.length>0){
      this.show.Spinner=true;
      var listvehicle ="";
      this.listdo.forEach(plan => {
        // เก็บค่า serialbox สำหรับใช้หาข้อมูลรถจาก GPS Gateway
        listvehicle += ((listvehicle==""?"'" : ",'") + plan.serialbox +"'")
        this.setactivty(plan,this.listactivity);
      });
      // console.log("this.listdo :",this.listdo);
      await this.setcompanydata();
      await this.setrealtimedata(listvehicle);
      // console.log("this.listcompany :",this.listcompany);
      // console.log("this.realtimedata :",realtimedata);
      this.show.Spinner=false;
    }
  }
  setactivty(plan: DashboardplanModel,listplanact: PlanactivityModel[]){
    for(var i=5;i<30;i+=5){
      // ปรับค่า เวลา ใน Activity ให้เท่ากับค่าในแผนงาน
      var planact = plan.listactivity.find(x=>x.statusid==i);
      if(planact){
        if(i==5){
          // set Wakeup data
          planact.statustime = plan.wakeuptime;
          planact.statustaget = plan.wakeuptime;
          planact.statuswarn= plan.wakeupworntime;
        }
        else if(i==10){
          // set Alcohol data
          planact.statustime = plan.starttime;
          planact.statustaget = plan.starttime;
          planact.statuswarn= plan.wakeupworntime;
        }
        else if(i==20){
          // set Start engine data
          planact.statustaget = plan.startwarntime;
          planact.statustime = plan.startwarntime;
          planact.statuswarn= plan.wakeupworntime;
        }
        else if(i==25){
          // set on the way data
          planact.statustaget = plan.starttime;
          planact.statustime = plan.starttime;
          planact.statuswarn= plan.wakeupworntime;              
        }
        else if(i==30){
          // set Finiish data
          planact.statustaget = plan.starttime;
          planact.statustime = plan.starttime;
          planact.statuswarn= plan.starttime;              
        }
        // ปรับค่า เวลา ใน Activity ให้เท่ากับค่าใน Activity ที่หาได้
        var listact = listplanact.find(x=>(x.docode==plan.docode)&&(x.statusid==i));
        if(listact){
          planact.statustime = listact.statustime;
          planact.lat = listact.lat;
          planact.lng = listact.lng;
          planact.transtatus =listact.transtatus;
          if(i==5){plan.wakeupact =listact.statustime;}
          else if(i==10){
            plan.acltime =listact.statustime;
            planact.statuslevel =listact.statuslevel;
          }
          else if(i==20){plan.startwarnact =listact.statustime;}
          else if(i==25){plan.startact =listact.statustime;}
          else if(i==30){plan.finishact =listact.statustime;}
        }
        // ปรับค่า last status
        if(plan.laststatus<i && planact.transtatus !=0){
          plan.laststatus = i;
          plan.laststatusname = this.va.getstatusname(i);
          plan.laststatuscolor  = this.va.getstatuscolor(i);           
          plan.laststatuswarn  = planact.statuswarn;
          plan.laststatustaget  = planact.statustaget;
          plan.laststatustime  = planact.statustime;
          plan.laststatuslevel  = planact.statuslevel;
        
        }
      }
    }

  }
  setcompanydata(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.listcompany.forEach(comp=>{
              comp.dolist=[];
              var listdo = this.listdo.filter(x=>x.cid==comp.cid).sort((a, b) => a.laststatus - b.laststatus);
              // console.log("listdo :" + comp.company,listdo);
              comp.dolist=listdo;
              comp.totaldo =listdo.length;
              comp.totalwake = this.listactivity.filter(x=>x.cid ==comp.cid&& x.statusid==5).length;
              comp.totalalc = this.listactivity.filter(x=>x.cid ==comp.cid&& x.statusid==10).length;
              comp.totalstart = this.listactivity.filter(x=>x.cid ==comp.cid&& x.statusid==20).length;
              comp.totalotw = this.listactivity.filter(x=>x.cid ==comp.cid&& x.statusid==25).length;
              comp.totalfinish = this.listactivity.filter(x=>x.cid ==comp.cid&& x.statusid==30).length;
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async setrealtimedata(listvehicle:string) {
    // var result:VehicleDashboard[] = []
    try{
      var wsname = 'getrealtimedata';
      var params = { tbname: 'vehiclerealtime', listserial: listvehicle };
      var jsondata = await this.va.getwsdata(wsname, params);
      if (jsondata.code == '000') {
        // console.log("setrealtimedata jsondata : ",jsondata.data);
        if (jsondata.data.length > 0) {          
          jsondata.data.forEach((item: any) => {
            var plan = this.listdo.find(x=>x.serialbox==item.serialbox);
            if(plan){
              plan.vlat = item.lat;
              plan.vlng = item.lng;
              plan.lastlat =item.lat;
              plan.lastlng = item.lng;
              plan.vstatus = item.gpsstatus;
              plan.vstatuscorlor = this.va.getvcolor(plan.vstatus );
              plan.vstatusname = this.va.getvstatusname(plan.vstatus );
              plan.vlocation = item.adminname;
              plan.vlocationcode = item.admincode;
              plan.vspeed = item.speed;
              plan.vheader = item.header;
              plan.vio = item.io;
              plan.gpstime = new Date(item.gpstime);    
                
            }
          });
        }
        return true;
      }
      // console.log(this.listdashboaddo);
  
    }catch(ex){console.log("getvehicledata error : ",ex)}
    //  console.log("getvehicledata result",result);
    // return result;
    return false;
  }

  //#endregion =========== Set Dash board Data =========================
  //===================================================================

  //===================================================================
  // #region  =========== Refresh Dash board Data =====================

  async refreshdo(){
    // this.listcompany = await this.getlistcompany();
    // this.show.Spinner=true;
    try{
      if(this.listcompany.length>0){
        var lasttime = new Date(this.lastplantime);
        var listnewplan = await this.getlistdriverplan();       
        // console.log("refreshdo newdo :",listnewplan);
        if(listnewplan.length>0){
          // ใส่ Activity ลงใน planใหม่
          var listact =  await this.getactivityplan(lasttime);
          listnewplan.forEach(plan => {
            this.setactivty(plan,listact);
            // หารถเก่าใส plan ใหม่ลงไป
            var idx = this.listdo.findIndex(x=>x.vid==plan.vid);
            // var oldplan = this.listdo.find(x=>x.vid==plan.vid);
            // console.log("plan1 :",plan);
            // console.log("oldplan :",oldplan);
            // console.log("idx :",idx);
            if(idx>=0){
              // update GPS data to new plan
              var oldplan = this.listdo[idx];
              plan.vlat = oldplan.vlat;
              plan.vlng = oldplan.vlng;
              plan.lastlat = oldplan.lastlat
              plan.lastlng = oldplan.lastlng;
              plan.vstatus = oldplan.vstatus;
              plan.vstatuscorlor = oldplan.vstatuscorlor;
              plan.vstatusname = oldplan.vstatusname;
              plan.vlocation = oldplan.vlocation;
              plan.vlocationcode = oldplan.vlocationcode;
              plan.vspeed = oldplan.vspeed;
              plan.vheader = oldplan.vheader;
              plan.vio = oldplan.vio;
              plan.gpstime = oldplan.gpstime;
              // oldplan = plan;
              // console.log("idx :",idx);
              this.listdo.splice(idx,1);
              this.listdo.push(plan);
              // console.log("plan2 :",plan);
              // console.log("this.listdo :",this.listdo);
            }
          });
          // Update Company ใหม่
          await this.setcompanydata();
          // console.log("refreshdo this.listcompany : ", this.listcompany)
          // this.show.Spinner=false;
        }
      } else{
        await this.setdashboarddata();    
      }
      }catch{}
    // this.show.Spinner=false;
  }

  // #endregion  =========== Refresh Dash board Data ==================
  //===================================================================

  //===================================================================
  // #region  =========== Leaflet  Map ================================

  private initMap(): void {
    this.map = L.map('map', {
      center: [13.6140328, 100.6162229], // Latitude and longitude of the center point
      zoom: 13, // Initial zoom level
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        }),
      ],
    });
  }
  async plotvehecle(){
    var lastpoint:any =[13,100];
    this.listdo.forEach(vehicle => {
      if(vehicle.vlat!=0&&vehicle.vlng!=0){
        var details = vehicle.routename
        var marker = this.plotMarker(vehicle.vlat,vehicle.vlng,vehicle.fullname,details,vehicle.lineimage,vehicle.vstatuscorlor);
        if(marker!=null){
          var id:number = vehicle.vid;
          this.vmarkers.push({id, marker});
          lastpoint=[vehicle.vlat,vehicle.vlng];
        }
      }
    });
    if(this.map){this.map.panTo(lastpoint);}  
  }
  addveheclepoint(vehicle:DashboardplanModel){
    if(vehicle.vlat!=0&&vehicle.vlng!=0){
      var details = vehicle.routename
      var marker = this.plotMarker(vehicle.vlat,vehicle.vlng,vehicle.fullname,details,vehicle.lineimage,vehicle.vstatuscorlor);
      if(marker!=null){
        var id:number = vehicle.vid;
        this.vmarkers.push({id, marker});
      }
    }
    if(this.map){this.map.panTo([vehicle.vlat,vehicle.vlng]);}  

  }
  private plotMarker(lat:any,lng:any,header:string,description:string,image:any,vstatus:string){
    if(this.map){     
      // var vstatus ="#fa0404"; 
      const customIcon = L.divIcon({
        html:`<div style="position: relative; width:${this.mapIconSize}px; height:${(this.mapIconSize*2)}px; display: flex;">'+
                <img src="${this.va.icon.poi}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
                <img src="${image}" style="position: absolute; top: 5%; left: 10%; width: 80%; height: 40%;  border-radius: 50%; z-index: 2; opacity: 1.0;" />
                <div style="position: absolute; bottom: 0%; left: 35%; width: 30%; height: 30%;  border-radius: 50%; z-index: 2; opacity: 1.0; background-color:${vstatus}"  />
              </div>`,
        className: '', // Remove default styling
        iconSize: [this.mapIconSize, this.mapIconSize*2], // Adjust size for side-by-side images
      });  
      var htmlPopup:string = `<div class='container'>   
                                <div class'row no-gutter' style='display: flex;'>
                                  <center><p><strong>${header}</strong></p></center>
                                </div> 
                                  <div class'row no-gutter'>
                                    <div class'col-3'> 
                                    <img style='width: 50px; height: 50px;' src='${image}'/> 
                                    </div> 
                                    <div class'col-8'> 
                                    <p>${description}</p>
                                  </div>
                                </div>  
                              </div>`
      const marker =L.marker([lat,lng],{ icon: customIcon }).addTo(this.map)
      .bindPopup(htmlPopup);

      marker.on('popupopen', function() {
        setTimeout(() => {marker.closePopup(); }, 3000); // 3000ms = 3 seconds
      });
      const resizeMarkerIcon = () => {
        const zoomLevel = this.map?.getZoom();
        
        // Calculate new size based on zoom level (adjust the scaling factor as needed)
        const zl = zoomLevel?zoomLevel:13;
        const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level
      
        // Update the marker icon size
        marker.setIcon(
          L.divIcon({
            html:`<div style="position: relative; width:${newSize}px; height:${(newSize*2)}px; display: flex;">
                    <img src="${this.va.icon.poi}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
                    <img src="${image}" style="position: absolute; top: 5%; left: 10%; width: 80%; height: 40%;  border-radius: 50%; z-index: 2; opacity: 1.0;" />
                    <div style="position: absolute; bottom: 0%; left: 35%; width: 30%; height: 30%;  border-radius: 50%; z-index: 2; opacity: 1.0; background-color:${vstatus}"  />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
          })
        );
      };
      
      this.map.on('zoom', resizeMarkerIcon);
      return marker;
    }
    return null;
  }
  private ShowCurrentPosition(lat:any,lng:any){
    try{
      if(this.map){   
        var zoom = this.map.getZoom();
        if(this.cmarkers){
          this.cmarkers.setLatLng([lat,lng]);
        } 
        else{
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
          this.cmarkers =L.marker([lat,lng],{ icon: customIcon }).addTo(this.map);

          setTimeout(() => {
            if(this.cmarkers){ 
              this.cmarkers.remove();
              this.cmarkers=undefined;
            }
          }, 3000); // 3000 milliseconds = 3 seconds
        }  
        this.map.setZoom(zoom);
        this.map.panTo([lat,lng]);
      }
    }catch(ex){console.log("ShowCurrentPosition error : ",ex)}

  }
  setCenter(lat: number, lng: number, zoomLevel: number=0): void {
    if (this.map) {
      var zoom =this.map.getZoom();
      if(zoomLevel!=0){zoom=zoomLevel;}
      this.map.setView([lat, lng], zoom);
      if(this.cmarkers){
        this.cmarkers.setLatLng([lat,lng]);
      } else{
        this.ShowCurrentPosition(lat,lng);
      }
    }
  }
  updateMarkerPosition(vehicle:DashboardplanModel): void {
    var vmarker = this.vmarkers.find(x=>x.id==vehicle.vid);
    if(vmarker){
      var marker =vmarker.marker;
      marker.setLatLng([vehicle.vlat, vehicle.vlng]);
      this.setCenter(vehicle.vlat, vehicle.vlng); 
      var msg = "Update location";
      if(vehicle){
        msg+=" of " +vehicle.vname + " On " + vehicle.vlat +","+vehicle.vlng;
        this.showSanckbar(msg,1)
      }
    }
    else{
      if(vehicle){
        this.addveheclepoint(vehicle);
        this.setCenter(vehicle.vlat, vehicle.vlng); 
        // this.ShowCurrentPosition(vehicle.lat, vehicle.lng);
        var msg = "Update location of " +vehicle.vname + " On " + vehicle.vlat +","+vehicle.vlng;
        this.showSanckbar(msg,1)
      }
    }
  }

  // #endregion =========== Leaflet  Map ==============================
  //===================================================================

  //===================================================================
  // #region  =========== Controls & Open Modal =======================

  showdriverposition(driver: DashboardplanModel){
    try{
      if(driver.vlat!=0&&driver.vlng!=0){
        if(this.map){ this.ShowCurrentPosition(driver.vlat, driver.vlng) }
      }  
      else{
        this.showSanckbar("No Position data",2)
      }
    }catch(ex){console.log("showdriverposition error :", ex);}
  }

  showdiverwork(plan: DashboardplanModel,comp :DashboardcompanyModel,modal:any) {
    try{
      this.activeplan=plan;
      this.activeplan.complogo = comp.complogo;
      // console.log("plan :" ,plan);
      this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
      // this.modalService.open(modal, { fullscreen: true });

    }catch(ex){console.log("showdiverwork error :",ex);}
  }
  async plandetailtalkback(plan: DashboardplanModel) {
    // console.log("plandetailtalkback plan",plan);
    this.activeplan=plan;

    var comp = this.listcompany.find(x=>x.cid==plan.cid)
    if(comp){
      var listdo = this.listdo.filter(x=>x.cid==comp?.cid).sort((a, b) => a.laststatus - b.laststatus);
      comp.dolist=listdo;
      comp.totaldo =listdo.length;
      comp.totalwake = this.listactivity.filter(x=>x.cid ==comp?.cid&& x.statusid==5).length;
      comp.totalalc = this.listactivity.filter(x=>x.cid ==comp?.cid&& x.statusid==10).length;
      comp.totalstart = this.listactivity.filter(x=>x.cid ==comp?.cid&& x.statusid==20).length;
      comp.totalotw = this.listactivity.filter(x=>x.cid ==comp?.cid&& x.statusid==25).length;
      comp.totalfinish = this.listactivity.filter(x=>x.cid ==comp?.cid&& x.statusid==30).length;  
    }
  }

  // #endregion  =========== Controls & Open Modal ====================
  //===================================================================

  //===================================================================
  // #region  =========== MQTT ========================================
  mqttconfig = this.va.mqttconfig;
  async connectMqtt() {
    try {
      var mqttclient = await mqtt.connect(this.mqttconfig.url, {
        clientId: 'client_' + Math.floor(Math.random() * 10000),
        username: this.mqttconfig.username,
        password: this.mqttconfig.password,
      });
      mqttclient.on('message', (receivedTopic: string, message: any) => {
        this.decodemqtt(receivedTopic, message);
      });
      return mqttclient;
    } catch (ex) {
      console.log('Error ========> ', ex);
    }
    return null;
  }
  async decodemqtt(topic: string, message: string) {
    const msg = message.toString();
    try{
      var data = JSON.parse(msg);
      if (topic === 'gbdupdate') {
        // console.log('decodemqtt gbdupdate data: ', data);
        this.updateactivitybymqtt(data);
      } else if (topic === 'gbusvupdate') {
        // console.log('decodemqtt gbusvupdate data: ', data);
        this.updatevehiclebymqtt(data);
      }else if (topic === 'gbdplanupdate') {
        // console.log('decodemqtt gbusvupdate data: ', data);
        this.updateplanbymqtt(data);
      }  
    }catch(ex){
      console.log("decodemqtt error ",ex)
      console.log("decodemqtt msg ", msg)
    }

  }
  updateactivitybymqtt(data:any){
    // หาว่าเป็นแผนของบริษัทไหน
    try{
      var com = this.listcompany.find(x=>x.cid==data.compid);
      if(com){
        // หาว่าเป็นแผนของรถคันไหน
        var vehicle = com.dolist.find(x=>x.docode==data.docode);
        if(vehicle){
          // หาว่าเป็น Activity ไหน
          var act = vehicle.listactivity.find(x=>x.statusid==data.statusid);
          // ปรับค่า Activity ตามข้อมูลที่เปลี่ยนไป
          if(act){
            act.transtatus=data.transtatus;
            if(data.transtatus==0){ act.statustime=this.va.defultdate;}
            else{
              act.statustime=new Date(data.statustime) ; 
              if(data.statusid==10){ act.statuslevel= data.statuslevel;}
            }
          }
          // หาว่าหาข้อมูล Last Activity
          const maxstatus = vehicle.listactivity
          .filter(x => x.transtatus !== 0)
          .sort((a, b) => b.statusid - a.statusid)[0];
          if (maxstatus) {
            vehicle.laststatus = maxstatus.statusid;
            vehicle.laststatuslevel = maxstatus.statuslevel;
            vehicle.laststatusname = maxstatus.statusname;
            vehicle.laststatustaget = maxstatus.statustaget;
            vehicle.laststatustime = maxstatus.statustime;
            vehicle.laststatuswarn = maxstatus.statuswarn;
            vehicle.laststatuscolor =this.va.getstatuscolor(vehicle.laststatus );
            // console.log("maxstatus:", maxstatus);
          }
        }
      }
    }catch(ex){console.log("UpdateActivitybyMqtt error",ex);}

  }
  async subscribeMqtt(mqttclient: MqttClient, topic: string) {
    try {
      if (mqttclient) {
          mqttclient.subscribe(topic, { qos: 0 }, (err: any) => {
          if (err) {
            console.log('err');
          } else {
            // console.log('Subscribed',topic);
          }
        });
      } else {
        this.showSanckbar('MQTT client is not connected.');
        // console.log('MQTT client is not connected.');
      }

      // mqttclient.on('message', (topic, message) => {
      //  if(topic=="gbusvupdate"){
      //    // console.log(`Received message on topic ${topic}: ${message.toString()}`);
      //    var data =message.toString();
      //    var jsondata = JSON.parse(data);
      //    this.updatevehiclebymqtt(jsondata);
      //  }else if(topic=="gbdupdate"){

      //  }
      // });

    } catch (ex) {
      console.log('Error ========> ', ex);
    }
  }
  async updatevehiclebymqtt(data:any){
    try{
      // หาข้อมูลรถที่ส่งมาว่ามีหรือไม่
      var plan = this.listdo.find(x=>x.serialbox==data.imei);
      // console.log("updatevehiclebymqtt plan : ",plan);
      if(plan){
          var com = this.listcompany.find(x=>x.cid==plan?.cid);
        if(com){
          var vehicle = com.dolist.find(x=>x.docode==plan?.docode);
          if(vehicle){
              vehicle.vlat = data.lat;
              vehicle.vlng = data.lng;
              vehicle.vheader = data.header;
              vehicle.vio = data.io;
              vehicle.gpstime = new Date(data.gpstime);
              vehicle.vspeed = data.speed;
              vehicle.vstatus = data.value;
              vehicle.vstatuscorlor = this.va.getvcolor(data.value);
              vehicle.vstatusname =  this.va.getvstatusname(data.value);
              if(data.admincode){
                vehicle.vlocationcode =data.admincode
                if(data.adminname){vehicle.vlocation =data.adminname}
                vehicle.lastlat=data.lat;
                vehicle.lastlng=data.lat;
              }
              else{
                var gap =this.va.getdistance(vehicle.lastlat,vehicle.lastlng,vehicle.vlat,vehicle.vlng);
                // console.log("gap :",gap);
                if(gap>5000){
                  // หาตำแหน่งใหม่
                  var location = await this.va.getadmin( data.lat, data.lng);
                  if(location){
                    vehicle.vlocation = data.adminname;
                    vehicle.vlocationcode = location.admincode;
                    vehicle.lastlat=data.lat;
                    vehicle.lastlng=data.lat;
                  }
                }
              }
              this.updateMarkerPosition(vehicle);
          }else{
            // console.log("vehicle not found : ",data.imei);
            this.showSanckbar("vehicle update location not found : ",data.imei)
          }
        }else{
          // console.log("com not found : ",data.imei);
          this.showSanckbar("vehicle update location not found : ",data.imei)
        } 
      }else{
        // console.log("plan not found : ",data.imei);
        this.showSanckbar("vehicle update location not found : ",data.imei)
      }  
      
    }catch(ex){console.log("updatevehiclebymqtt error : ",ex);}
  }

  updateplanbymqtt(data:any){
    // console.log("updateplanbymqtt data :",data)
    this.refreshdo();
  }


  // #endregion  =========== MQTT =====================================
  //===================================================================

  //===================================================================
  // #region  =========== Message Dialog ==============================

  alertMessage(header: string, message: string) {
      var dialogRef = this.dialog.open(DialogpageComponent,
        { data: new DialogConfig(header, message, false) }
      );
      dialogRef.afterClosed().subscribe(result => {
        // console.log("Dialog result : ",result);
      });
  }
  OkCancelMessage(header: string, message: string): Promise<any>{
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
  showSanckbar(message: string, duration = 5) {
      this.snacbar.open(message, 'Close',
        { duration: (duration * 1000), horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

  // #endregion  =========== Message Dialog ===========================
  //===================================================================


}

 