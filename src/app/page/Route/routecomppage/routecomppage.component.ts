import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { DialogpageComponent,DialogConfig} from '../../../material/dialogpage/dialogpage.component';
import { RouteModel,CompanyModel,DPinroutedata,VehicleRoutedata,
  CalendarplanModel,RouteplanModel,VehicleplanModel,Calendarslot,VehicleModel,
  Calendardata,CalendardayplanModel,RoutedayplanModel} from '../../../models/datamodule.module';
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

  @Input() activecompany: CompanyModel = new CompanyModel();

  show = { Spinner: true, viewtype: 0 };
  public maindata: RouteModel[] = [];
  public activedata: RouteModel = new RouteModel();
  // public activevehicle: VehicleRoutedata = new VehicleRoutedata();
  private map: L.Map | undefined;
  private mapIconSize = 30;
  private cmarkers: L.Marker | undefined;

  public weekplan: CalendarplanModel[] = [];
  public dayplan: CalendardayplanModel = new CalendardayplanModel(this.va.calendarperiod);
  
  public activecalendar: CalendarplanModel | undefined;
  public selectedvehicle: VehicleModel = new VehicleModel();
  public activeslot: Calendarslot = new Calendarslot();
  public activeplan :RouteplanModel|undefined;
  public createroutemodal : any;
  private routepolygonLayer: L.GeoJSON | null = null;  // polygon form selectpolyline
  private companymarker: L.Marker|undefined;  // company point 
  
  async ngOnInit() {
    await this.showroutetab(this.show.viewtype);
    console.log("activecompany : ",this.activecompany)
  }
  async refreshpage(){
    this.maindata = await this.getData();
    // console.log("Routecomppage.refreshdata : ",this.show.viewtype)
    await this.showroutetab(this.show.viewtype);
  }
  async showroutetab(id:number){
    this.show.viewtype=id;
    this.show.Spinner = true;
    if(this.maindata.length==0){this.maindata = await this.getData();}

    if(id==0){
      if(this.dayplan.plandate  = new Date("2000-01-01 00:00:00")){
        await this.setdayplan();
      }
      await this.setactivedayplan(this.dayplan.plandate);
    }else if(id==1){
      if(this.activedata.id==0 && this.maindata.length>0){
        this.setweekplan();
        this.activedata =this.maindata[0];    
      }
      await this.ShowVehicleDetail(this.activedata);
    }else if(id==2){
      if(this.activedata.id==0 && this.maindata.length>0){
        this.activedata =this.maindata[0];
      }
      this.Showroute(this.activedata);
    // await this.SetdropointRoute();
    // await this.SetVehicleRoute();    
    // 
    }

    this.show.Spinner = false;
      
  }
  async getData() {
    var result: RouteModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'routecomp', compid: this.activecompany.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    console.log("getData routecomp jsondata : ", jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new RouteModel();
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
  openempdata(item: RouteModel, modal: any) {
    // console.log('opencompanydata comp : ', item);
    this.activedata = item;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, { fullscreen: true });
    
  }
  routedetailtalkback(event: any) {
    this.refreshpage();
  }
  Showrouteconfig(route: RouteModel, modal: any) {
    // console.log('Showroutedropoint route', route);
    this.activedata = route;
    // this.modalService.open(modal, { fullscreen: true });
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});


  }

  // ==========================================================
  // #region ========== Route Map =============================
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
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
  
        // Display coordinates in a popup
        var pointpopup = L.popup()
          .setLatLng(e.latlng)
          .setContent(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`)
        if(this.map){pointpopup.openOn(this.map);}
  
        // Alternatively, log to the console
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      });
      this.PlotRoute();
      this.setcompanymarker();
      return true;
    } catch (ex) {
      console.log('initMap error : ', ex);
    }
    return false;
  }
  
  Showroute(route: RouteModel) {
    // console.log('Showroute route : ', route);
    this.activedata = route;
    if (!this.map) {
      this.initMap();
    } else {
      this.PlotRoute();
    }
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
        this.companymarker =L.marker([this.activecompany.lat, this.activecompany.lng],{ icon: customIcon }).addTo(this.map);
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
        this.companymarker.bindPopup(this.activecompany.companyname);
      }else{
        // update startmarker
        this.companymarker.setLatLng([this.activecompany.lat, this.activecompany.lng]);
      }
      this.map.panTo(new L.LatLng(this.activecompany.lat, this.activecompany.lng));
    }
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
  addnewroute(modal :any){
    this.activedata = new RouteModel();
    this.activedata.ownerid = this.activecompany.id;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    // this.modalService.open(modal, { fullscreen: true });
    this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});

  }
  routeconfigtalkback(event: any) {
    this.refreshpage();
  }

  // #endregion ========= Route Map ===========================
  // ==========================================================

  // #region ============ Route Polygon ===========================
  public updateroutetalkback(polygon:any){
    if(polygon!=""){
      // console.log("updateroutetalkback polygon : ",polygon)
      this.activedata.polygon=polygon;
      this.PlotRoute();
    }else{
      this.activedata.polygon="";
      if(this.map){ if (this.routepolygonLayer) { this.map.removeLayer(this.routepolygonLayer); }}
    }
  }
  async PlotRoute() {
    this.show.Spinner = true;
    // Remove the existing layer if it exists
    if(this.map){ if (this.routepolygonLayer) { this.map.removeLayer(this.routepolygonLayer); }}
    if(this.activedata.polygon==""){ this.activedata.polygon= await this.getroutepolygon(); }
    if(this.activedata.polygon!=""){
      var polygondata:L.LatLng[]=this.data2latlngarray(this.activedata.polygon)
      const geoJsonData = this.latLngToGeoJSON(polygondata);
      this.createPolygon(geoJsonData);
    }
    this.show.Spinner = false;
    return true;
  }

  async getroutepolygon() {
    try{
      var wsname = 'getroutedata';
      var params = { routeid: this.activedata.id ,type:1 ,isone:true};
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log('getpolygon jsondata : ', jsondata);
      if (jsondata.code == '000') {
        return jsondata.data.polygon;
      } else {
        this.showSanckbar("getroutepolygon No data",2);
      }
      // console.log('getPlandayData result : ', result);
    } catch(ex){console.log("getpolygon error : ",ex)}
    return "";
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
  private createPolygon(geoJsonData: GeoJSON.Feature<GeoJSON.Polygon>):void{
      if(this.map){
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

  editpolygon(modal:any){
    this.modalService.open(modal, { fullscreen: true ,backdrop: 'static', keyboard: false, centered: true});
  }

  // #endregion ========= Route Polygon ===========================
  // ==============================================================

  // ==========================================================
  // #region  ========= Day Plan ==============================
  async setdayplan(){
    this.dayplan = new CalendardayplanModel(this.va.calendarperiod);
    // console.log("this.dayplan : ",this.dayplan);
    this.dayplan.setactivedate(new Date());
    this.dayplan.activeroute =[]
    // console.log("setdayplan this.maindata : ",this.maindata);
    this.maindata.forEach(route => {
      var plan: RoutedayplanModel = new RoutedayplanModel(this.dayplan.plandate,route);
      this.dayplan.activeroute.push(plan);
    });
    // console.log("setdayplan this.dayplan : ",this.dayplan);
    // await this.setactivedayplan(new Date());
  }
  async setactivedayplan(activedate:Date){
    this.dayplan.setactivedate(activedate);

    var listactiveroute = this.dayplan.listrouteplan.filter(x=>x.plankey==this.dayplan.plankey);
    // console.log("setactivedayplan this.dayplan :",this.dayplan)
    // console.log("setactivedayplan listactiveroute :",listactiveroute)
    if(listactiveroute&&listactiveroute.length>0){
      // ใส่ค่าที่หาได้จาก listactiveroute ใน activeroute
      this.dayplan.activeroute=listactiveroute;
    }else{
      // หาค่าจากฐานข้อมูลมาเติม
      var listnewplan =  await this.getPlandayData(this.dayplan.plankey);
      if(listnewplan.length>0){
        this.dayplan.activeroute.forEach(actday => {
          var newplan:RoutedayplanModel = new RoutedayplanModel(activedate,actday.route);
          var listnewrouteplan = listnewplan.filter(x=>x.routeid==newplan.route.id);
          if(listnewrouteplan.length>0){
            listnewrouteplan.forEach(plan  => {
              this.dayplan.listplan.push(plan);
              var vehicle:VehicleplanModel|undefined;
                //หาว่าเคยสร้างข้อมูลรถไว้หรือยัง ถ้าสร้างแล้วไม่ต้องทำอะไร 
                if(newplan.listvplan.length>0){ 
                  vehicle = newplan.listvplan.find(x=>x.vid==plan.vid);
                }
              //ถ้ายังไม่มีข้อมูลให้สร้างรถ และนำข้อมูลทุกแผนของรถคันนี้มาใส่ข้อมูล แต่ถ้า
              if(!vehicle){
                vehicle = new VehicleplanModel(plan,this.va.calendarperiod );
                // นำข้อมูลทุกแผนของรถคันนี้มาใส่ข้อมูล listdata
                var lisvehicleplan = listnewplan.filter(x=>x.vid==vehicle?.vid);
                if(lisvehicleplan.length>0){
                  lisvehicleplan.forEach(vplan=>{
                    var listslot = vehicle?.listdata.filter((item) =>
                      this.getslotinrange(item.sdate,item.edate,vplan.wakeupwarntime,vplan.endtime )
                    );
                    if(listslot&&listslot.length>0){
                      listslot.forEach(slot=>{
                        slot.plancode = vplan.plancode;
                        slot.routeid = vplan.routeid;
                      });
                    }
                  });
                }else{
                  // console.log("lisvehicleplan.length:",lisvehicleplan.length)
                }
                newplan.listvplan.push(vehicle);
                // console.log("setactivedayplan newplan.listvplan :",newplan);
                // console.log("vehicle:",vehicle)  
              }
            });
          }
          actday.listvplan=newplan.listvplan;
          actday.listplan=newplan.listplan;
          this.dayplan.listrouteplan.push(Object.assign(newplan));
        });
      } 
      else{
        this.dayplan.activeroute.forEach(actday => {        
          actday.listvplan=[];
        });
      }

     
    }
    this.dayplan.noplan = this.dayplan.activeroute.find(x=>x.listvplan.length>0) != undefined;

  }
  async movedayplan(step:number){
    var actday = new Date( this.dayplan.plandate);
    actday.setDate(actday.getDate()+step);
    await this.setactivedayplan(actday);
     
  }
  async getPlandayData(plankey: string) {
    var result: RouteplanModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'planday', plankey: plankey };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log('getWeekData jsondata : ', jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new RouteplanModel(data);
        // temp.setdata(data);
        result.push(temp);
      });
    } else {
      this.showSanckbar("getPlandayData No data",2);
    }
    // console.log('getPlandayData result : ', result);
    return result;
  }
  async setdayplanfromweekplan(route:RouteModel|undefined){
    try{
      
      var plandate = this.va.DateToString("yyyy-MM-dd",this.dayplan.plandate)
      var msg= "คุณต้องการสร้างแผนงานวันที่ " + plandate + " จากข้อมูลแผนงานรายสัปดาห์ "+(route?("เส้นทาง"+route.routename):"ทั้งหมด") +" หรือไม่";
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก",msg);
      if(confirm=="true"){
        if(await this.saveweektoplan(plandate,route)){
          this.clearacttiveplan();
          await this.setactivedayplan(this.dayplan.plandate);
        }else{this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")}
      }
    }catch(ex){
      console.log("setdayplanfromweekplan error ",ex)
      this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }
  async saveweektoplan(plandate:string,route:RouteModel|undefined){
    try{
      var wsname = "updatedata";
      var param:any;
      if(route){ param={tbname:"weektodayplan",plandate:plandate,routeid:route.id,compid:this.activecompany.id} }
      else { param={tbname:"weektodayplan",plandate:plandate,compid:this.activecompany.id};}
      var jsondata = await this.va.getwsdata(wsname,param)
      if(jsondata.code=="000"){
        this.showSanckbar("create plan from week success",2);
        return true;
      }
    }catch(ex){
      console.log("saveweektoplan Error : ",ex)
      this.showSanckbar("create plan from week  error" + ex,2);
    }
    return false;
  }
  async deldayplan(route:RouteModel|undefined){
    try{
      var plandate = this.va.DateToString("yyyy-MM-dd",this.dayplan.plandate)
      var msg= "คุณต้องการลบแผนงานวันที่ " + plandate + " จากข้อมูลแผนงานรายสัปดาห์ "+(route?("เส้นทาง"+route.routename):"ทั้งหมด") +" หรือไม่";
      var confirm =await this.OkCancelMessage("ยืนยันการลบ",msg);
      if(confirm=="true"){
        if(await this.deletedayplan(plandate,route)){
          this.clearacttiveplan();
          await this.setactivedayplan(this.dayplan.plandate);
        }else{this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")}
      }
    }catch(ex){
      console.log("deldayplan error ",ex)
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }
  async deletedayplan(plandate:string,route:RouteModel|undefined){
    try{
      var wsname = "deldata";
      var param:any;
      if(route){ param={tbname:"weektodayplan",plandate:plandate,routeid:route.id,compid:this.activecompany.id} }
      else { param={tbname:"weektodayplan",plandate:plandate,compid:this.activecompany.id};}
      var jsondata = await this.va.getwsdata(wsname,param)
      if(jsondata.code=="000"){
        this.showSanckbar("delete plan from week success",2);
        return true;
      }
    }catch(ex){
      console.log("deletedayplan Error : ",ex)
      this.showSanckbar("delete plan from week  error" + ex,2);
    }
    return false;
  }
  clearacttiveplan(){
    this.dayplan.listrouteplan = this.dayplan.listrouteplan.filter(x => x.plankey !== this.dayplan.plankey);
  }
  opendayplan(item : Calendardata, vehicle:VehicleplanModel,routeid:number,modal:any ){
    // console.log("opendayplan item:",item)
    item.routeid = routeid;
    var selectroute = this.maindata.find(x=>x.id==item.routeid);
    if(selectroute){this.activedata=selectroute;} 
    // console.log("opendayplan this.activedata :",this.activedata);
    if(item.plancode==""){ 
      this.CreateDayPlan(item,vehicle,modal);
    }else{
      this.activeplan= this.dayplan.listplan.find(x=>x.plancode==item.plancode);
      var route = this.maindata.find(x=>x.id == this.activeplan?.routeid);
      if(route){this.activedata=route;}
      if(this.activeplan && (this.activeplan.routeid==this.activedata.id)){
        this.EditDayPlan(item,vehicle,modal);
      }else{
        var routename ="";
        if(this.activeplan){routename=this.activeplan.routename;}
        this.alertMessage("แจ้งเตือน","ไม่สามารถแก้ไขข้อมูล" + routename+ " ข้ามแผนงานได้");
      }
    }

  }
  CreateDayPlan(item : Calendardata, vehicle:VehicleplanModel,modal:any ){
    try{
      this.activeplan=undefined;
      this.activeslot.setdata(item);
      this.activeslot.plantype = 3;
      this.activeslot.dayname = this.va.DateToString("d MMM yyyy",this.dayplan.plandate) ;
      this.selectedvehicle.vid = vehicle.vid;
      this.selectedvehicle.vname = vehicle.vname;
      this.selectedvehicle.vlicent = vehicle.vlicent;
      this.selectedvehicle.driverid = vehicle.driverid;
      this.selectedvehicle.drivername = vehicle.drivername;
      this.selectedvehicle.driverphone = vehicle.driverphone;
      this.selectedvehicle.driverimage = vehicle.driverimage;
      this.selectedvehicle.gpsvid = vehicle.gpsvid;
      var startpoint = this.GetStartplan(item.id, item.plancode,vehicle);
      if(startpoint){
        this.activeslot.startid = startpoint.startid;
        this.activeslot.sdate = startpoint.starttime;
        this.activeslot.starttime = this.va.DateToString("HH:mm",startpoint.starttime) ;
      }    
      var endpoint = this.GetEndplan( item.id, item.plancode,vehicle);
      if(endpoint){
        this.activeslot.endid = endpoint.endid;
        this.activeslot.edate = endpoint.endtime;
        this.activeslot.endtime = this.va.DateToString("HH:mm",endpoint.endtime) ;
      }
      this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
    }catch(ex){
      console.log("CreateDayPlan error : ",ex);
    }
  }
  EditDayPlan(item : Calendardata,vehicle:VehicleplanModel,modal:any ){
    try{
      this.activeslot.setdata(item);
      this.activeslot.plantype = 3;
      this.activeslot.dayname = this.va.DateToString("d MMM yyyy",this.dayplan.plandate) ;
      this.selectedvehicle.vid = vehicle.vid;
      this.selectedvehicle.vname = vehicle.vname;
      this.selectedvehicle.vlicent = vehicle.vlicent;
      var startpoint = this.GetStartplan(item.id, item.plancode,vehicle);
      if(startpoint){
        this.activeslot.startid = startpoint.startid;
        this.activeslot.sdate = startpoint.starttime;
        this.activeslot.starttime = this.va.DateToString("HH:mm",startpoint.starttime) ;
      }    
      var endpoint = this.GetEndplan(item.id, item.plancode,vehicle);
      if(endpoint){
        this.activeslot.endid = endpoint.endid;
        this.activeslot.edate = endpoint.endtime;
        this.activeslot.endtime = this.va.DateToString("HH:mm",endpoint.endtime) ;
      }
        if(this.activeplan){this.activeplan.plantype =3;}
        // ปรับแต่งแผนงานเดิม (ควรเอา slot ว่างด้านหน้าและด้านหลังไปด้วย )
        // หาเวลาว่างก่อนplan
        if(this.activeslot.startid >0){
          var startempty = this.GetStartplan(this.activeslot.startid-1 , "",vehicle);
          if(startempty){
            this.activeslot.startid = startempty.startid;
            this.activeslot.sdate = startempty.starttime;
            this.activeslot.starttime = this.va.DateToString("HH:mm",startempty.starttime) ;
          }      
        }
        // หาเวลาว่างหลังplan
        var totalslot = Math.floor(1440/this.va.calendarperiod);
        if(this.activeslot.endid< totalslot){
          var endempty = this.GetEndplan(this.activeslot.endid+1 , "",vehicle);
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
  addvehicledayplan(route:RouteModel,modal:any,routemodal:any){
    this.activecalendar =  new CalendarplanModel(1440,0,this.dayplan.plandate);
    this.activedata = route;
    this.createroutemodal = routemodal;
    this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
  }
  // #endregion  ========= Day Plan ==============================
  // ==========================================================
 
  // ==========================================================
  // #region  ========= Weekly Plan ===========================
  async setweekplan() {
    var startweek = new Date(2000, 0, 2);
    var a = startweek.getDay();
    // console.log("startweek : ",a);
    this.weekplan = [];
    for (var i = 0; i < 7; i++) {
      var w = new CalendarplanModel( this.va.calendarperiod, i, startweek);
      w.iddate = this.va.DateToString('yyyyMMdd', w.cdate);
      this.weekplan.push(w);
      startweek.setDate(startweek.getDate() + 1);
    }
  }
  Showroutedropoint(route: RouteModel, modal: any) {
    // console.log('Showroutedropoint route', route);
    this.activedata = route;
    this.modalService.open(modal, { fullscreen: true });
  }
  async ShowVehicleDetail(route: RouteModel) {
    this.show.Spinner = true;
    this.activedata = route;

    if (this.show.viewtype == 1) {
      await this.setweekplan();
      var weekdata: RouteplanModel[] = await this.getWeekData(route.id);
      weekdata.forEach((plan) => {
        var id = this.va.DateToString('yyyyMMdd', plan.plandate);
        var wplan = this.weekplan.find((x) => x.iddate == id);
        if (wplan) {
          var vehicle = wplan.listvplan.find((x) => x.vid == plan.vid);
          if (!vehicle) {
            vehicle = new VehicleplanModel(plan,this.va.calendarperiod,wplan.cdate );
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
    var result: RouteplanModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'routeweek', routeid: routeid };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log('getWeekData jsondata : ', jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new RouteplanModel(data);
        // temp.setdata(data);
        result.push(temp);
      });
    } else {
      this.showSanckbar("getWeekData No data",2);
    }
    // console.log('getWeekData result : ', result);
    return result;
  }
  getslotinrange( sdate: Date, edate: Date, startDate: Date, endDate: Date ): boolean {
    // const date = new Date(dateStr); // Convert string to Date
    // return !isNaN(date.getTime()) && date >= startDate && date <= endDate;
    return sdate <= endDate && edate > startDate;
  }
  addvehicleweekplan(selectedslot: CalendarplanModel, modal: any, routemodal:any) {
    if (this.activedata.id != 0) {
      this.activecalendar = selectedslot;
      this.createroutemodal = routemodal;
      this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
    } else {
      this.alertMessage('แจ้งเตือน', 'กรุณาเลือกเส้นทาง');
    }
  }
  async selectvehicletalkback(event: any) {
    // console.log('event',event);
    this.activeslot = event.slot;
    this.selectedvehicle = event.vehicle;
    this.activeplan = undefined;
    this.modalService.open(this.createroutemodal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
  }

  // #region  ========= Add & Edit Weekly plan ==============================

  OpenWeekplan(item : Calendardata, wplan: CalendarplanModel,vehicle:VehicleplanModel,modal:any ){
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
  EditWeekPlan(item : Calendardata, wplan: CalendarplanModel,vehicle:VehicleplanModel,modal:any ){
    try{
      this.activeslot.setdata(item);
      this.activeslot.plantype = 2;
      this.activeslot.dayname = wplan.textdate;
      this.selectedvehicle.vid = vehicle.vid;
      this.selectedvehicle.vname = vehicle.vname;
      this.selectedvehicle.vlicent = vehicle.vlicent;
      var startpoint = this.GetStartplan(item.id, item.plancode,vehicle);
      if(startpoint){
        this.activeslot.startid = startpoint.startid;
        this.activeslot.sdate = startpoint.starttime;
        this.activeslot.starttime = this.va.DateToString("HH:mm",startpoint.starttime) ;
      }    
      var endpoint = this.GetEndplan(item.id, item.plancode,vehicle);
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
          var startempty = this.GetStartplan(this.activeslot.startid-1 , "",vehicle);
          if(startempty){
            this.activeslot.startid = startempty.startid;
            this.activeslot.sdate = startempty.starttime;
            this.activeslot.starttime = this.va.DateToString("HH:mm",startempty.starttime) ;
          }      
        }
        // หาเวลาว่างหลังplan
        var totalslot = Math.floor(1440/this.va.calendarperiod);
        if(this.activeslot.endid<totalslot){
          var endempty = this.GetEndplan( this.activeslot.endid+1 , "",vehicle);
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
  CreateWeekPlan(item : Calendardata, wplan: CalendarplanModel,vehicle:VehicleplanModel,modal:any ){
    try{
      // console.log("CreateWeekPlan item : ",item);
      // console.log("CreateWeekPlan wplan : ",wplan);
      // console.log("CreateWeekPlan vehicle : ",vehicle);
      this.activeplan=undefined;
      this.activeslot.setdata(item);
      this.activeslot.plantype = 2;
      this.activeslot.dayname = wplan.textdate;
      this.selectedvehicle.vid = vehicle.vid;
      this.selectedvehicle.vname = vehicle.vname;
      this.selectedvehicle.vlicent = vehicle.vlicent;
      this.selectedvehicle.driverid = vehicle.driverid;
      this.selectedvehicle.drivername = vehicle.drivername;
      this.selectedvehicle.driverphone = vehicle.driverphone;
      this.selectedvehicle.driverimage = vehicle.driverimage;
      var startpoint = this.GetStartplan( item.id, item.plancode,vehicle);
      if(startpoint){
        this.activeslot.startid = startpoint.startid;
        this.activeslot.sdate = startpoint.starttime;
        this.activeslot.starttime = this.va.DateToString("HH:mm",startpoint.starttime) ;
      }    
      var endpoint = this.GetEndplan(item.id, item.plancode,vehicle);
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
  // ==========================================================
  // #region  ========= update data and find plan slot ========

  async routeplantalkback(routeplan: RouteplanModel) {
    // console.log("routeplantalkback event : ",event);
    if(routeplan.plantype==3){
      // ปรับข้อมูลแผนงานรายวันใหม่
      this.dayplan.listrouteplan = this.dayplan.listrouteplan.filter(x => x.plankey !== this.dayplan.plankey);
      await this.setactivedayplan( this.dayplan.plandate);
    } else if(routeplan.plantype==2){
      // ปรับข้อมูลแผนงานรายสัปดาห์ใหม่
      await this.ShowVehicleDetail(this.activedata);
    } else {

    }
  }
  GetStartplan(id:number, plancode: string,vehicle:VehicleplanModel){
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
  GetEndplan( id:number, plancode: string,vehicle:VehicleplanModel){
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

// #endregion  ========= update data and find plan slot ======================

  exportprint(){}
  exportexcel(){}

  //  #endregion  ========= Add & Edit Weekly plan ==============================

  // #endregion  ========= Weekly Plan ===========================
  // ==========================================================

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

