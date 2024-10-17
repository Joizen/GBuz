import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import {
  DialogpageComponent,
  DialogConfig,
} from '../../../material/dialogpage/dialogpage.component';

import {
  Routedata,
  Companydata,
  DPinroutedata,
  VehicleRoutedata,
  Calendarplan,
  Routeplandata,
  Vehicleplan,
  Calendarslot,
  Vehicledata,
  Calendardata,
  Calendardayplan,
  Routedayplan
} from '../../../models/datamodule.module';
import * as L from 'leaflet';



@Component({
  selector: 'app-routecomppage',
  templateUrl: './routecomppage.component.html',
  styleUrls: ['./routecomppage.component.scss'],
})
export class RoutecomppageComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) {}

  @Input() activecompany: Companydata = new Companydata();

  show = { Spinner: true, viewtype: 0 };
  public maindata: Routedata[] = [];
  public activedata: Routedata = new Routedata();
  public activevehicle: VehicleRoutedata = new VehicleRoutedata();
  private map: L.Map | undefined;
  private mapIconSize = 30;
  private cmarkers: L.Marker | undefined;

  public weekplan: Calendarplan[] = [];
  public dayplan: Calendardayplan = new Calendardayplan(this.va.calendarperiod);
  
  public activecalendar: Calendarplan | undefined;
  public copyslot: Vehicleplan | undefined;
  public selectedvehicle: Vehicledata = new Vehicledata();
  public activeslot: Calendarslot = new Calendarslot();
  public activeplan :Routeplandata|undefined;
  public createroutemodal : any;

  async ngOnInit() {
    // console.log('Routecomppage ngOnInit activecompany', this.activecompany);
    this.maindata = await this.getData();
    await this.setdayplan();
    await this.SetdropointRoute();
    await this.SetVehicleRoute();    
    this.setweekplan();
    this.show.Spinner = false;
    
  }

  async getData() {
    var result: Routedata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'routecomp', compid: this.activecompany.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getData jsondata : ", jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new Routedata();
        temp.setdata(data);
        result.push(temp);
      });      
    } else {
    }
    return result;
  }
  async SetdropointRoute() {
    var result: DPinroutedata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'dpinroutecomp', compid: this.activecompany.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getData jsondata : ", jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new DPinroutedata();
        temp.setdata(data);
        result.push(temp);
      });
      if (this.maindata) {
        this.maindata.forEach((route) => {
          var listdp = result.filter((x) => x.routeid == route.id);
          if (listdp) {
            listdp.sort((a: any, b: any) => a.item - b.item);
            var totalperiod = 0;
            var totaldistance = 0;
            var pointtime = this.activedata.starttime;
            this.activedata.dpinroute.forEach((dp) => {
              pointtime.setMinutes(pointtime.getMinutes() + dp.period);
              dp.pointtime = new Date(pointtime);
              dp.totaldistance = totaldistance + dp.distance;
              totaldistance = dp.totaldistance;
              dp.totalperiod = totalperiod + dp.period;
              totalperiod = dp.totalperiod;
            });
            route.dpinroute = listdp;
          } else {
            route.dpinroute = [];
          }
        });
      }
    } else {
    }
    this.show.Spinner = false;
    return result;
  }

  async SetVehicleRoute() {
    var result: VehicleRoutedata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'vehicleroutecomp', compid: this.activecompany.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log('getData jsondata : ', jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new VehicleRoutedata();
        temp.setdata(data);
        result.push(temp);
      });
      if (this.maindata) {
        this.maindata.forEach((route) => {
          var listvehicle = result.filter((x) => x.routeid == route.id);
          if (listvehicle) {
            route.vinroute = listvehicle;
          } else {
            route.vinroute = [];
          }
        });
      }
    } else {
    }
    this.show.Spinner = false;
    return result;
  }

  openempdata(item: Routedata, modal: any) {
    // console.log('opencompanydata comp : ', item);
    this.activedata = item;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, { fullscreen: true });
  }

  companytalkback(event: any) {}
  Showroutedropoint(route: Routedata, modal: any) {
    // console.log('Showroutedropoint route', route);
    this.activedata = route;
    this.modalService.open(modal, { fullscreen: true });
  }

  // #region  ========= Route Map ==============================

  //--------------------- Leaflet  Map------------------------
  async initMap() {
    try {
      // console.log('this.map : ', this.map);
      this.map = L.map('droppointmap', {
        center: [13.6140328, 100.6162229], // Latitude and longitude of the center point
        zoom: 13, // Initial zoom level
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
          }),
        ],
      });
      this.PlotRoute();
      return true;
    } catch (ex) {
      console.log('initMap error : ', ex);
    }
    return false;
  }

  Showroute(route: Routedata) {
    // console.log('Showroute route : ', route);
    this.activedata = route;
    if (!this.map) {
      this.initMap();
    } else {
      this.PlotRoute();
    }
  }

  async PlotRoute() {
    var lastpoint: any = [13, 100];
    this.activedata.dpinroute.forEach((item) => {
      if (item.lat != 0 && item.lng != 0) {
        var marker = this.plotMarker(item.lat, item.lng, item.pointname);
        lastpoint = [item.lat, item.lng];
      }
    });
    if (this.map) {
      this.map.panTo(lastpoint);
    }
    return true;
  }

  private plotMarker(lat: any, lng: any, header: string) {
    if (this.map) {
      const customIcon = L.divIcon({
        html: `<div style="position: relative; width:${
          this.mapIconSize
        }px; height:${this.mapIconSize * 2}px; display: flex;">
                <img src="${
                  this.va.icon.dpoi
                }" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
              </div>`,
        className: '', // Remove default styling
        iconSize: [this.mapIconSize, this.mapIconSize * 2], // Adjust size for side-by-side images
      });
      var htmlPopup: string = `<div class='container'>   
                                <div class'row no-gutter' style='display: flex;'>
                                  <center><p><strong>${header}</strong></p></center>
                                </div> 
                              </div>`;
      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(htmlPopup);

      marker.on('popupopen', function () {
        setTimeout(() => {
          marker.closePopup();
        }, 3000); // 3000ms = 3 seconds
      });
      const resizeMarkerIcon = () => {
        const zoomLevel = this.map?.getZoom();

        // Calculate new size based on zoom level (adjust the scaling factor as needed)
        const zl = zoomLevel ? zoomLevel : 13;
        const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level

        // Update the marker icon size
        marker.setIcon(
          L.divIcon({
            html: `<div style="position: relative; width:${newSize}px; height:${
              newSize * 2
            }px; display: flex;">
                    <img src="${
                      this.va.icon.dpoi
                    }" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [newSize, newSize * 2], // Adjust size for side-by-side images
          })
        );
      };

      this.map.on('zoom', resizeMarkerIcon);
      return marker;
    }
    return null;
  }

  public async ShowCurrentPosition(lat: any, lng: any) {
    try {
      if (this.map) {
        if (this.cmarkers) {
          this.cmarkers.setLatLng([lat, lng]);
        } else {
          const zoomLevel = this.map?.getZoom();
          const zl = zoomLevel ? zoomLevel : 13;
          const newSize = this.mapIconSize * (zl / 13);
          const customIcon = L.divIcon({
            html: `<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                    <img src="${this.va.icon.thispoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
            iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
          });
          this.cmarkers = L.marker([lat, lng], { icon: customIcon }).addTo(
            this.map
          );

          setTimeout(() => {
            if (this.cmarkers) {
              this.cmarkers.remove();
              this.cmarkers = undefined;
            }
          }, 3000); // 3000 milliseconds = 3 seconds
        }
        this.map.setZoom(15);
        this.map.panTo([lat, lng]);
      } else {
        await this.initMap();
      }
    } catch (ex) {
      console.log('ShowCurrentPosition error : ', ex);
    }
  }

  addvehicleinroute(modal: any) {
    this.modalService.open(modal, { fullscreen: true });
  }
  // #endregion

  // #region  ========= Day Plan ==============================
  async setdayplan(){
    this.dayplan = new Calendardayplan(this.va.calendarperiod);
    console.log("this.dayplan : ",this.dayplan);
    this.dayplan.setactivedate(new Date());
    this.dayplan.activeroute =[]
    this.maindata.forEach(route => {
      var plan: Routedayplan = new Routedayplan();
      plan.plankey =this.dayplan.plankey;
      plan.plandate =this.dayplan.plandate;
      plan.route =route;
      this.dayplan.activeroute.push(plan);
    });
    console.log("setdayplan this.dayplan : ",this.dayplan);
    // await this.setactivedayplan(new Date());
  }

  async setactivedayplan(activedate:Date){
    
    var listactiveroute = this.dayplan.listrouteplan.filter(x=>x.plankey==this.dayplan.plankey);
    if(listactiveroute&&listactiveroute.length>0){
      // ใส่ค่าที่หาได้จาก listactiveroute ใน activeroute

    }else{
      // หาค่าจากฐานข้อมูลมาเติม

      // เอาค่าที่ได้มาใส่ในแต่ละ route
     
    }

    // this.maindata.forEach(route => {
    //   var plan: Calendardayplan = new Calendardayplan();
    //   plan.route =route;
    //   this.dayplan.push(plan);
    // });
  }

  async getdayplan(step:number){
    var actday = new Date( this.dayplan.plandate);
    actday.setDate(actday.getDate()+step);
    console.log("actday : ",actday);
    this.dayplan.setactivedate(actday);
    console.log(" this.dayplan : ", this.dayplan);
    var data =  await this.getPlandayData(this.dayplan.plankey);
  }

  async getPlandayData(plankey: string) {
    var result: Routeplandata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'planday', plankey: plankey };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log('getWeekData jsondata : ', jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new Routeplandata();
        temp.setdata(data);
        result.push(temp);
      });
    } else {
      alert('getPlandayData No data');
    }
    console.log('getPlandayData result : ', result);
    return result;
  }


  // #endregion


  // #region  ========= Weekly Plan ==============================

  // ========= Show plan of Route ==============================
  async setweekplan() {
    var startweek = new Date(2000, 0, 2);
    var a = startweek.getDay();
    // console.log("startweek : ",a);
    this.weekplan = [];
    for (var i = 0; i < 7; i++) {
      var w = new Calendarplan( 15, i, startweek);
      w.iddate = this.va.DateToString('yyyyMMdd', w.cdate);
      this.weekplan.push(w);
      startweek.setDate(startweek.getDate() + 1);
    }
  }

  async ShowVehicleDetail(route: Routedata) {
    this.show.Spinner = true;
    this.activedata = route;

    if (this.show.viewtype == 1) {
      await this.setweekplan();
      var weekdata: Routeplandata[] = await this.getWeekData(route.id);
      weekdata.forEach((plan) => {
        var id = this.va.DateToString('yyyyMMdd', plan.plandate);
        var wplan = this.weekplan.find((x) => x.iddate == id);
        if (wplan) {
          var vehicle = wplan.listvplan.find((x) => x.vid == plan.vid);
          if (!vehicle) {
            vehicle = new Vehicleplan(plan.vid,plan.vname,plan.vlince,15,wplan.cdate );
            vehicle.routeday = wplan.id;
            wplan.listvplan.push(vehicle);
          }
          const listslot = vehicle.listdata.filter((item) =>
            this.getslotinrange(item.sdate,item.edate,plan.wakeupwarntime,plan.endtime )
          );

          if (listslot) {
            listslot.forEach((slot) => {
              slot.plancode = plan.plancode;
              slot.routeid = plan.routeid;
            });
          }
          wplan.listplan.push(plan);
        }
        // console.log('ShowVehicleDetail wplan : ', wplan);
      });
    }
    // console.log('ShowVehicleDetail this.weekplan : ', this.weekplan);
    this.show.Spinner = false;
  }

  async getWeekData(routeid: number) {
    var result: Routeplandata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'routeweek', routeid: routeid };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log('getWeekData jsondata : ', jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new Routeplandata();
        temp.setdata(data);
        result.push(temp);
      });
    } else {
      alert('getWeekData No data');
    }
    // console.log('getWeekData result : ', result);
    return result;
  }

  getslotinrange( sdate: Date, edate: Date, startDate: Date, endDate: Date ): boolean {
    // const date = new Date(dateStr); // Convert string to Date
    // return !isNaN(date.getTime()) && date >= startDate && date <= endDate;
    return sdate <= endDate && edate > startDate;
  }

  addvehicleweekplan(selectedslot: Calendarplan, modal: any, routemodal:any) {
    if (this.activedata.id != 0) {
      this.activecalendar = selectedslot;
      this.createroutemodal = routemodal;
      this.modalService.open(modal, { size: 'lg' });
    } else {
      this.alertMessage('แจ้งเตือน', 'กรุณาเลือกเส้นทาง');
    }
  }

  async selectvehicletalkback(event: any) {
    this.activeslot = event.slot;
    this.selectedvehicle = event.vehicle;
    this.modalService.open(this.createroutemodal, { size: 'lg' });
  }

  routeplantalkback(event: any) {
    this.ShowVehicleDetail(this.activedata);
  }

   // #region  ========= Add & Edit Weekly plan ==============================
  OpenWeekplan(item : Calendardata, wplan: Calendarplan,vehicle:Vehicleplan,modal:any ){
    if(item.plancode==""){
      this.CreateWeekPlan(item,wplan,vehicle,modal);
    }else{
      var thisplan=wplan.listplan.find(x=>x.plancode==item.plancode);
      if(thisplan && (thisplan.routeid==this.activedata.id)){
        this.EditWeekPlan(item,wplan,vehicle,modal);
      }else{
        var routename ="";
        if(thisplan){routename=thisplan.routename;}
        // console.log("OpenWeekplan thisplan :",thisplan)
        this.alertMessage("แจ้งเตือน","ไม่สามารถแก้ไขข้อมูล" + routename+ " ข้ามแผนงานได้");
      }
    }
  }

  EditWeekPlan(item : Calendardata, wplan: Calendarplan,vehicle:Vehicleplan,modal:any ){
    try{
      this.activeslot.setdata(item);
      this.activeslot.plantype = 2;
      this.activeslot.dayname = wplan.textdate;
      this.selectedvehicle.vid = vehicle.vid;
      this.selectedvehicle.vname = vehicle.vname;
      this.selectedvehicle.vlicent = vehicle.vlince;
      var startpoint = this.GetStartWeekplan(wplan, item.id, item.plancode,vehicle);
      if(startpoint){
        this.activeslot.startid = startpoint.startid;
        this.activeslot.sdate = startpoint.starttime;
        this.activeslot.starttime = this.va.DateToString("HH:mm",startpoint.starttime) ;
      }    
      var endpoint = this.GetEndWeekplan(wplan, item.id, item.plancode,vehicle);
      if(endpoint){
        this.activeslot.endid = endpoint.endid;
        this.activeslot.edate = endpoint.endtime;
        this.activeslot.endtime = this.va.DateToString("HH:mm",endpoint.endtime) ;
      }
        this.activeplan=wplan.listplan.find(x=>x.plancode==item.plancode);
        if(this.activeplan){this.activeplan.plantype =2;}
        // ปรับแต่งแผนงานเดิม (ควรเอา slot ว่างด้านหน้าและด้านหลังไปด้วย )
        // หาเวลาว่างก่อนplan
        if(this.activeslot.startid >0){
          var startempty = this.GetStartWeekplan(wplan, this.activeslot.startid-1 , "",vehicle);
          if(startempty){
            this.activeslot.startid = startempty.startid;
            this.activeslot.sdate = startempty.starttime;
            this.activeslot.starttime = this.va.DateToString("HH:mm",startempty.starttime) ;
          }      
        }
        // หาเวลาว่างหลังplan
        if(this.activeslot.endid<wplan.listdata.length){
          var endempty = this.GetEndWeekplan(wplan, this.activeslot.endid+1 , "",vehicle);
          if(endempty){
            this.activeslot.endid = endempty.endid;
            this.activeslot.edate = endempty.endtime;
            this.activeslot.endtime = this.va.DateToString("HH:mm",endempty.endtime) ;
          }
        }
      this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
    }catch(ex){
      console.log("EditWeekPlan error : ",ex);
    }
  }


  CreateWeekPlan(item : Calendardata, wplan: Calendarplan,vehicle:Vehicleplan,modal:any ){
    try{
      this.activeplan=undefined;
      this.activeslot.setdata(item);
      this.activeslot.plantype = 2;
      this.activeslot.dayname = wplan.textdate;
      this.selectedvehicle.vid = vehicle.vid;
      this.selectedvehicle.vname = vehicle.vname;
      this.selectedvehicle.vlicent = vehicle.vlince;
      var startpoint = this.GetStartWeekplan(wplan, item.id, item.plancode,vehicle);
      if(startpoint){
        this.activeslot.startid = startpoint.startid;
        this.activeslot.sdate = startpoint.starttime;
        this.activeslot.starttime = this.va.DateToString("HH:mm",startpoint.starttime) ;
      }    
      var endpoint = this.GetEndWeekplan(wplan, item.id, item.plancode,vehicle);
      if(endpoint){
        this.activeslot.endid = endpoint.endid;
        this.activeslot.edate = endpoint.endtime;
        this.activeslot.endtime = this.va.DateToString("HH:mm",endpoint.endtime) ;
      }
      this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
    }catch(ex){
      console.log("CreateWeekPlan error : ",ex);
    }
  }

   GetStartWeekplan(wplan: Calendarplan, id:number, plancode: string,vehicle:Vehicleplan){
    // console.log("GetStartWeekplan this.activeplan ",this.activeplan);
    var result = {startid:id, starttime: vehicle.listdata[id].sdate}
    for(var i=id; i>=0;i--){
      var slot = vehicle.listdata[i];
      if(slot.plancode==plancode){
        result.startid = slot.id;
        result.starttime = slot.sdate;
      }
      else{
        return result;
      }
    }
    return result;
  }

  GetEndWeekplan(wplan: Calendarplan, id:number, plancode: string,vehicle:Vehicleplan){
    var result = {endid:id, endtime: vehicle.listdata[id].edate}
    for(var i=id; i<vehicle.listdata.length;i++){
      var slot = vehicle.listdata[i];
      if(slot.plancode==plancode){
        result.endid = slot.id;
        result.endtime = slot.edate;
      }
      else{
        return result;
      }
    }
    return result;
  }

  // #endregion


  // #endregion


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

}
