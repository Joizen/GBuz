import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { VehicleModel, CompanyModel, VehicleRoutedata,CalendarplanModel, Calendardata, Calendarslot, RouteplanModel } from '../../../models/datamodule.module'
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-vehiclecomppage',
  templateUrl: './vehiclecomppage.component.html',
  styleUrls: ['./vehiclecomppage.component.scss']
})

export class VehiclecomppageComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) { }
  @Input() activecompany: CompanyModel = new CompanyModel();
  show = { Spinner: true, viewtype: 1 ,filter:false,vid:0,day:7};
  public maindata: VehicleModel[] = [];
  public activedata: VehicleModel = new VehicleModel();
  public weekplan: CalendarplanModel[] = [];
  public activeslot : Calendarslot = new Calendarslot();
  public listplan :RouteplanModel[]=[];
  public listfillterplan :RouteplanModel[]=[];
  public activeplan :RouteplanModel|undefined;

  public copyslot :CalendarplanModel|undefined;

  async ngOnInit() {
    this.maindata = await this.getData();
    await this.SetVehicleRoute();
    await this.setweekplan();
    await this.settablevplan();
  }
  async refreshpage(){
    // console.log("Vehiclecomppage.refreshdata : ",this.show.viewtype)
    // await this.showroutetab(this.show.viewtype);
  }

  async getData() {
    var result: VehicleModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'vehiclecomp', compid: this.activecompany.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    //  console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new VehicleModel(data);
        result.push(temp);
      });
    } else {

    }
    this.show.Spinner = false;
    return result;

  }

  async SetVehicleRoute() {
    var result: VehicleRoutedata[] = [];
    var wsname = 'getdata';
    var params = {tbname: 'vehicleroutecomp', compid: this.activecompany.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new VehicleRoutedata();
        temp.setdata(data);
        result.push(temp);
      });
      if (this.maindata) {
        this.maindata.forEach(vehicle => {
          var route = result.filter(x => x.vid == vehicle.vid);
          // console.log("SetVehicleRoute route : ",route);
          if (route) { vehicle.listroute = route; }
          else { vehicle.listroute = []; }
        });
      }
    } else {

    }
    this.show.Spinner = false;
    return result;

  }



  // openempdata(item: Vehicledata, modal: any) {
  //   console.log("opencompanydata comp : ", item);
  //   this.activedata = item;
  //   // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
  //   this.modalService.open(modal, { fullscreen: true });

  // }


   // ====================================================
   // ========= Weekly Plan ==============================
   // ====================================================

   // ========= Show plan of vehicle ==============================
   async setweekplan(){
    var startweek = new Date(2000,0,2); 
    var a = startweek.getDay();
    // console.log("startweek : ",a);
    this.weekplan=[]
    for(var i =0;i<7;i++){
      var w =new CalendarplanModel(15,i,startweek);
      w.iddate = this.va.DateToString("yyyyMMdd",w.cdate);
      this.weekplan.push(w);
      startweek.setDate(startweek.getDate()+1);
    }
    
    // console.log("this.weekplan ", this.weekplan);

  }
  
   async ShowVehicleDetail(vehicle:VehicleModel){
    this.show.Spinner=true;
    this.activedata = vehicle;

    if(this.show.viewtype==1){
      await this.setweekplan();
      var weekplan =  await this.getWeekData(vehicle.vid);
      weekplan.forEach(plan => {
        var id = this.va.DateToString("yyyyMMdd",plan.plandate)
        var wplan = this.weekplan.find(x=>x.iddate==id);
        if(wplan){
          const listslot = wplan.listdata.filter(item => 
            this.getslotinrange(item.sdate,item.edate, plan.wakeupwarntime, plan.endtime)
          );
          if(listslot){
            listslot.forEach(slot => {
              slot.plancode=plan.plancode;
            });
          }
          wplan.listplan.push(plan);
        }  
        // console.log("ShowVehicleDetail wplan : ",wplan);
      });
    }
      // console.log("ShowVehicleDetail this.weekplan : ",this.weekplan);
      this.show.Spinner=false;
  }

  getslotinrange(sdate: Date, edate: Date, startDate: Date, endDate: Date): boolean {
    // const date = new Date(dateStr); // Convert string to Date
    // return !isNaN(date.getTime()) && date >= startDate && date <= endDate;
    return sdate<=endDate && edate > startDate;
  }

  async getWeekData(vid:number|undefined) {
    var result: RouteplanModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'routeweek', vid: vid,compid: this.activecompany.id};
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getWeekData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new RouteplanModel(data);
        // temp.setdata(data);
        result.push(temp);
      });
    } else {
      alert("getWeekData No data");
    }
    // console.log("getWeekData result : ", result);
    return result;
  }

   // ========= Add & Edit Weekly plan ==============================
  OpenWeekplan(item : Calendardata, wplan: CalendarplanModel,modal:any ){
    this.activeslot.setdata(item);
    this.activeslot.plantype = 2;
    this.activeslot.dayname = wplan.textdate;

    var startpoint = this.GetStartWeekplan(wplan, item.id, item.plancode);
    if(startpoint){
      this.activeslot.startid = startpoint.startid;
      this.activeslot.sdate = startpoint.starttime;
      this.activeslot.starttime = this.va.DateToString("HH:mm",startpoint.starttime) ;
    }    
    var endpoint = this.GetEndWeekplan(wplan, item.id, item.plancode);
    if(endpoint){
      this.activeslot.endid = endpoint.endid;
      this.activeslot.edate = endpoint.endtime;
      this.activeslot.endtime = this.va.DateToString("HH:mm",endpoint.endtime) ;
    }
    if(item.plancode==""){
      // สร้างแผนงานใหม่
      this.activeplan=undefined;
    }else{
      this.activeplan=wplan.listplan.find(x=>x.plancode==item.plancode);
      if(this.activeplan){this.activeplan.plantype =2;}
      // ปรับแต่งแผนงานเดิม (ควรเอา slot ว่างด้านหน้าและด้านหลังไปด้วย )
      // หาเวลาว่างก่อนplan
      if(this.activeslot.startid >0){
        var startempty = this.GetStartWeekplan(wplan, this.activeslot.startid-1 , "");
        if(startempty){
          this.activeslot.startid = startempty.startid;
          this.activeslot.sdate = startempty.starttime;
          this.activeslot.starttime = this.va.DateToString("HH:mm",startempty.starttime) ;
        }      
      }
      // หาเวลาว่างหลังplan
      if(this.activeslot.endid<wplan.listdata.length){
        var endempty = this.GetEndWeekplan(wplan, this.activeslot.endid+1 , "");
        if(endempty){
          this.activeslot.endid = endempty.endid;
          this.activeslot.edate = endempty.endtime;
          this.activeslot.endtime = this.va.DateToString("HH:mm",endempty.endtime) ;
        }
      }
    }

    // console.log("OpenWeekplan this.activeplan ",this.activeplan);
    // console.log("OpenWeekplan this.activeslot : ",this.activeslot);
    // this.modalService.open(modal, { fullscreen: true });

    if(this.activedata.vid==0){
      alert("กรุณาเลือกรถที่ต้องการจัดเส้นทาง");
      return;
    }
    this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
  }
  GetStartWeekplan(wplan: CalendarplanModel, id:number, plancode: string){
    var result = {startid:id, starttime: wplan.listdata[id].sdate}
    for(var i=id; i>=0;i--){
      var slot = wplan.listdata[i];
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
  GetEndWeekplan(wplan: CalendarplanModel, id:number, plancode: string){
    var result = {endid:id, endtime: wplan.listdata[id].edate}
    for(var i=id; i<wplan.listdata.length;i++){
      var slot = wplan.listdata[i];
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
  routeplantalkback(event: any) {
    this.ShowVehicleDetail(this.activedata)
  }

 // ========= Copy & Paste==============================
  copyweekplan(wplan: CalendarplanModel){
    wplan.ismaseter=true;
    this.copyslot =wplan;    
  }
  clearcopyweekplan(){
    this.copyslot =undefined;
    this.weekplan.forEach(wplan => {
      wplan.ismaseter=false;
      wplan.isselect=false;
    });
  }

  async updatecopyweekplan(){
    // delete old & save new
    var slotcopyto : CalendarplanModel[] = [];
    var strday : string = "";
    var copyweekplan: any[] = [];
    var vid =  this.activedata.vid;
    var copytype = 0;
    this.weekplan.forEach(wp => {
      if(wp.isselect){
        slotcopyto.push(wp);
        copyweekplan.push({
          "copytype" : copytype,
          "vid" : vid,
          "fromrouteday" : this.copyslot?.id,
          "torouteday" : wp.id          
      })
        strday+=  ((strday==""?"วัน":", วัน") + wp.textdate);
      } 
    });
    var msg = "คัดลอกแผนงาน วัน"+this.copyslot?.textdate + " ไปยัง " + strday;
    var confirm =await this.OkCancelMessage("ยืนยันการคัดลอก","คุณต้องการ"+msg+"หรือไม่");
    if(confirm=="true"){
      for(var i=0; i<copyweekplan.length; i++){
        await this.setcopyplan(copyweekplan[i]);
      }
    }
    
    // console.log("slotcopyto : ",slotcopyto);
    this.clearcopyweekplan();
    this.ShowVehicleDetail( this.activedata)
  }

  async setcopyplan(data:any){
    try{
      var wsname = "copyweekplan";
      var jsondata = await this.va.getwsdata(wsname,data)
      if(jsondata.code=="000"){
        this.showSanckbar("Copy plan "+ data.torouteday +" success",2);
        return true;
      }
    }catch(ex){
      this.showSanckbar("Copy plan "+ data.torouteday +" Error" + ex,2);
      // console.log("setcopyplan Error : ",ex)
    }
    return false;
  }

  exportprint(){}
  exportexcel(){
    if(this.show.viewtype==1){
      // Step 1: ลบฟิลด์ id, driverimg ออกจากข้อมูล
      const filteredData = this.maindata.map(({driverid,driverimage,vid,listroute,provinceid,qrcode, ...rest }) => rest);
      // Step 2: สร้าง worksheet จากข้อมูลที่ถูกกรองแล้ว
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
      // Step 3: สร้าง workbook และเพิ่ม worksheet
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Vehicle': worksheet },
        SheetNames: ['Vehicle']
      };
      // Step 4: ส่งออก workbook เป็นไฟล์ Excel
      XLSX.writeFile(workbook, 'VehicleInCompanyData.xlsx');
      }

    if(this.show.viewtype==2){
      // Step 1: ลบฟิลด์ ออกจากข้อมูล
      const filteredData = this.listfillterplan.map(({ownerid,issend,ot,plandate,plankey,plantype,routecode,routeday,routeid,routetype,shiftid,transtatus,vid, ...rest }) => rest);
      // Step 2: สร้าง worksheet จากข้อมูลที่ถูกกรองแล้ว
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
      // Step 3: Set custom specific columns
      // worksheet['!cols'] = [
      //   { wch: 5 }, // Column width for "id"
      //   { wch: 20 }, // Column width for "name"
      //   { wch: 20 }, // Column width for "timestamp"
      // ];

      // Step 4: สร้าง workbook และเพิ่ม worksheet
      const workbook: XLSX.WorkBook = {
        Sheets: { 'MasterPlan': worksheet },
        SheetNames: ['MasterPlan']
      };
      // Step 4: ส่งออก workbook เป็นไฟล์ Excel
      XLSX.writeFile(workbook, 'MasterPlanData.xlsx');

    }
  }

  //===================================================================
  // #region  =========== Table Vehicle Plan ==========================

  async settablevplan(){
    this.listplan = await this.getWeekData(undefined);
    this.listfillterplan = this.listplan;
  }
  searchlistplan(){
    // console.log("this.show ",this.show);
    if(this.show.vid==0&&this.show.day<7){
      this.listfillterplan = this.listplan.filter(x=>x.routeday==this.show.day);
    }else if(this.show.vid>0&&this.show.day==7){
      this.listfillterplan = this.listplan.filter(x=>x.vid==this.show.vid);
    }else if(this.show.vid>0&&this.show.day<7){
      this.listfillterplan = this.listplan.filter(x=>x.routeday==this.show.day&&x.vid==this.show.vid);      
    }else if(this.show.vid==0&&this.show.day<7){
      this.listfillterplan = this.listplan;      
    }
  }

  Showweekplan(item : RouteplanModel, modal:any ){
    this.activeplan =item;
  }

  // #endregion  =========== Table Vehicle Plan =======================
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
