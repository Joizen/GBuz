import { Component,Input,EventEmitter, Output, OnInit    } from '@angular/core';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleModel,CompanyModel,RouteModel,RouteplanModel, Calendarslot, ComshiftModel} from '../../../models/datamodule.module'
import { variable } from '../../../variable';

@Component({
  selector: 'app-plandatapage',
  templateUrl: './plandatapage.component.html',
  styleUrls: ['./plandatapage.component.scss']
})
export class PlandatapageComponent implements OnInit {
  constructor(private modalService: NgbModal,public va: variable,private snacbar: MatSnackBar,private dialog:MatDialog){ }
  @Input() modal: any;
  @Input() vehicle: VehicleModel = new VehicleModel();
  @Input() company: CompanyModel = new CompanyModel();
  @Input() planslot: Calendarslot = new Calendarslot();
  @Input() editplan: RouteplanModel |undefined;
  @Input() routedata : RouteModel | undefined;
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();

  show = {Spinner: true,keyword:"",vehicle:true};
  routelist: RouteModel[] = [];
  selectrout : RouteModel = new RouteModel();
  selectshift : ComshiftModel = new ComshiftModel();
  selecttime={start:"00:00", end : "00:00",startwarn:"00:00",wakeup:"00:00",wakeupwarn:"00:00"} ; 
  activeplan : RouteplanModel =new RouteplanModel();
  selectmodal:any;
  unplanvehicle:VehicleModel[]=[];
  showunplanvehicle:VehicleModel[]=[];
  selectvehicle:VehicleModel|undefined;

  public listshift : ComshiftModel []= [];
  
  onperiod=false;


  async ngOnInit() {
    try{
      if(this.editplan){
        this.activeplan=this.editplan;
        this.selectrout.routename=this.activeplan.routename;
        this.selectrout.id = this.activeplan.routeid;
        this.selectrout.routecode = this.activeplan.routecode;
        this.selectrout.ownerid = this.activeplan.ownerid;
        this.selectrout.routename = this.activeplan.routename;
        this.selectrout.routetype = this.activeplan.routetype;
        this.selectrout.routetypename = this.activeplan.routetypename;
        this.selectrout.distance = this.activeplan.distance;
        this.selectrout.period = this.activeplan.period;
        this.selectrout.starttime = this.activeplan.starttime;
        this.selectrout.wakeupwarn = this.activeplan.wakeupwarn;
        this.selectrout.wakeupwarntime = this.activeplan.wakeupwarntime;
        this.selectrout.wakeup = this.activeplan.wakeup;
        this.selectrout.wakeuptime = this.activeplan.wakeuptime;
        this.selectrout.startwarn = this.activeplan.startwarn;
        this.selectrout.startwarntime = this.activeplan.startwarntime;
        this.selectrout.endtime = this.activeplan.endtime;
        this.selecttime.end = this.va.DateToString("HH:mm",this.activeplan.endtime);
        this.selecttime.start = this.va.DateToString("HH:mm",this.activeplan.starttime);
        this.selecttime.startwarn = this.va.DateToString("HH:mm",this.activeplan.startwarntime);
        this.selecttime.wakeup = this.va.DateToString("HH:mm",this.activeplan.wakeuptime);
        this.selecttime.wakeupwarn = this.va.DateToString("HH:mm",this.activeplan.wakeupwarntime);
      }else{
        this.listshift = await this.getshiftData();
        await this.createnewplan();
      } 
      if(this.routedata){
        this.selectrout = this.routedata;
      }
    }catch(ex){console.log("ngOnInit error : ", ex); }
    this.onperiod = this.checkperiod();
    this.show.Spinner=false;  
  }

  checkperiod(){
    if(this.activeplan.starttime < this.planslot.sdate ||this.activeplan.starttime > this.planslot.edate ){return false;} 
    if(this.activeplan.endtime < this.planslot.sdate ||this.activeplan.endtime > this.planslot.edate ){return false;} 
    if(this.activeplan.wakeuptime < this.planslot.sdate ||this.activeplan.wakeuptime > this.planslot.edate ){return false;} 
    if(this.activeplan.wakeupwarntime < this.planslot.sdate ||this.activeplan.wakeupwarntime > this.planslot.edate ){return false;} 
    if(this.activeplan.startwarntime < this.planslot.sdate ||this.activeplan.startwarntime > this.planslot.edate ){return false;} 
    return true;
  }

  async createnewplan(){
    try{
      this.activeplan.plantype =this.planslot.plantype;
      this.activeplan.plandate=new Date(this.planslot.sdate);
      this.activeplan.plandate.setHours(0,0,0,0);  
      this.activeplan.plankey=this.va.DateToString("yyyyMMdd",this.activeplan.plandate);  
      this.activeplan.plantype = this.planslot.plantype;
      this.activeplan.starttime = new Date(this.activeplan.plandate);
      this.activeplan.endtime = new Date(this.activeplan.plandate);

      if(this.company && this.company.id!=0){
        // สำหรับ สร้างแผนงานที่ต้องใช้ข้อมูลรถ
        this.activeplan.ownerid =this.company.id;
        if(this.vehicle){
          this.activeplan.vid = this.vehicle.vid;
          this.activeplan.vlicent = this.vehicle.vlicent;
          this.activeplan.vname = this.vehicle.vname;
          this.activeplan.driverid = this.vehicle.driverid;
          this.activeplan.drivername = this.vehicle.drivername;
          this.activeplan.driverphone = this.vehicle.driverphone;
          this.activeplan.driverimage = this.vehicle.driverimage;
        }
        if(this.routedata){
          this.activeplan.routeid = this.routedata.id;
          this.activeplan.routecode = this.routedata.routecode;
          this.activeplan.routename = this.routedata.routename;
          this.activeplan.routetype = this.routedata.routetype;
          this.activeplan.routetypename = this.routedata.routetypename;
        }else{
          this.routelist = await this.getrouteData();
          if(this.routelist.length>0){
            this.selectrout =this.routelist[0]; 
            this.routechange();
          }
        }
      }else{
        this.alertMessage("Error","No company data");
      }
      this.shiftchange();
  
    }catch(ex){console.log("createnewplan error : ", ex);    }
  }


  setoptionchange(event: Event,type:number){
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    if(type==0){ this.activeplan.routetypename = selectedText; }
    else if(type==1){ this.activeplan.shiftname= selectedText; }
    else if(type==2){ this.activeplan.otname= selectedText; }
    this.shiftchange();

  }
  shiftchange(){
    // console.log("Selectedshift : ", this.selectshift);    
    this.activeplan.shiftid = this.selectshift.id;
    // ปรับ เวลาตาม shipf ที่เลือก
    if(this.activeplan.issend==0){ // ถ้ารับเข้าบริษัท
      // ปรับเวลาส่ง ให้เป็นไปตามเวลาส่งตามกะ      
      this.selecttime.end = this.va.DateToString("HH:mm",this.selectshift.sendtime);
      // ไม่ต้องเลือก OT
      this.activeplan.ot=0;
      this.activeplan.otname="ปกติ";
      this.activeplanchange("end");
    }
    else{ // ถ้าส่งกลับบ้าน
      // ปรับเวลาส่งสุดท้ายให้เป็น เวลารับต้นทางตาม OT + period       
      if(this.activeplan.ot==0){
      this.selecttime.start = this.va.DateToString("HH:mm",this.selectshift.receivetime);
      }
      else{
        this.selecttime.start = this.va.DateToString("HH:mm",this.selectshift.ottime);
      }
      this.activeplanchange("start");
    }
  }

  activeplanchange(type:string=""){
    if(type=="end"){
      const [hours, minutes] = this.selecttime.end.split(':').map(Number); 
      this.activeplan.endtime.setHours(hours, minutes);
      if(this.activeplan.endtime<this.activeplan.starttime){
        this.alertMessage("แจ้งเตือน","ไม่สามารถกำหนดเวลาถึงปลายทางก่อนเริ่มเดินทางได้");
        var temptime = new Date(this.activeplan.endtime);
        temptime.setMinutes(temptime.getMinutes()-this.activeplan.period);
        this.activeplan.starttime= new Date(temptime);        
        this.selecttime.start=this.va.DateToString("HH:mm",this.activeplan.starttime);
      }else{
        this.activeplan.period = this.va.getperiodinminutes(this.activeplan.endtime,this.activeplan.starttime)
      }
      this.updateactivetime(0,false);
    }
    else if(type=="start"){
      const [hours, minutes] = this.selecttime.start.split(':').map(Number); 
      this.activeplan.starttime.setHours(hours, minutes);
      if(this.activeplan.endtime<this.activeplan.starttime){
        this.alertMessage("แจ้งเตือน","ไม่สามารถกำหนดเวลาถึงปลายทางก่อนเริ่มเดินทางได้");
        var temptime = new Date(this.activeplan.starttime);
        temptime.setMinutes(temptime.getMinutes()+this.activeplan.period);
        this.activeplan.endtime= new Date(temptime);        
        this.selecttime.end=this.va.DateToString("HH:mm",this.activeplan.endtime);
      }else{
        this.activeplan.period = this.va.getperiodinminutes(this.activeplan.endtime,this.activeplan.starttime)
      }
      this.updateactivetime(0,true);
    }
    else if(type=="startwarn"){
      const [hours, minutes] = this.selecttime.startwarn.split(':').map(Number); 
      this.activeplan.startwarntime.setHours(hours, minutes);
      if(this.activeplan.startwarntime>this.activeplan.starttime){
        this.alertMessage("แจ้งเตือน","ไม่สามารถกำหนดเวลาสตาร์ทหลังเริ่มเดินทางได้");
        this.activeplan.startwarntime=new Date(this.activeplan.starttime);
        this.selecttime.startwarn=this.va.DateToString("HH:mm",this.activeplan.startwarntime);
      }
      this.activeplan.startwarn = this.va.getperiodinminutes(this.activeplan.startwarntime,this.activeplan.starttime)
      this.updateactivetime(1,false);
    }
    else if(type=="wakeup"){
      const [hours, minutes] = this.selecttime.wakeup.split(':').map(Number); 
      this.activeplan.wakeuptime.setHours(hours, minutes);
      if(this.activeplan.wakeuptime>this.activeplan.starttime){
        this.alertMessage("แจ้งเตือน","ไม่สามารถกำหนดเวลาเช็คอินหลังเริ่มเดินทางได้");
        this.activeplan.wakeuptime=new Date(this.activeplan.starttime);
        this.selecttime.wakeup=this.va.DateToString("HH:mm",this.activeplan.wakeuptime);
      }
      this.activeplan.wakeup = this.va.getperiodinminutes(this.activeplan.wakeuptime,this.activeplan.starttime)
      this.updateactivetime(1,false);
    }
    else if(type=="wakeupwarn"){
      const [hours, minutes] = this.selecttime.wakeupwarn.split(':').map(Number); 
      this.activeplan.wakeupwarntime.setHours(hours, minutes);
      if(this.activeplan.wakeupwarntime>this.activeplan.starttime){
        this.alertMessage("แจ้งเตือน","ไม่สามารถกำหนดเวลาปลุกหลังเริ่มเดินทางได้");
        this.activeplan.wakeupwarntime=new Date(this.activeplan.starttime);
        this.selecttime.wakeupwarn=this.va.DateToString("HH:mm",this.activeplan.wakeupwarntime);
      }
      this.activeplan.wakeupwarn = this.va.getperiodinminutes(this.activeplan.wakeupwarntime,this.activeplan.starttime)
      this.updateactivetime(1,false);
    }
  }

  updateactivetime(index:number,isstart:boolean){
    if(index==0){
      if(isstart){
        // ถ้าเวลาปลายต้นทางเปลี่ยน ให้ปรับเวลาปลายทาง  เพิ่มตาม period
        var endtime = new Date(this.activeplan.starttime);
        endtime.setMinutes(endtime.getMinutes()+this.activeplan.period);
        this.activeplan.endtime= new Date(endtime);        
        this.selecttime.end=this.va.DateToString("HH:mm",this.activeplan.endtime);
      }
      else{
        // ถ้าเวลาปลายทางเปลี่ยน ให้ปรับเวลาต้นทาง  ลดลงตาม period
        var starttime = new Date(this.activeplan.endtime);
        starttime.setMinutes(starttime.getMinutes()-this.activeplan.period);
        this.activeplan.starttime= new Date(starttime);        
        this.selecttime.start=this.va.DateToString("HH:mm",this.activeplan.starttime);
      }
    }

    var starttime = new Date(this.activeplan.starttime);
    var temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.activeplan.startwarn);
    this.activeplan.startwarntime = new Date(temptime);
    this.selecttime.startwarn=this.va.DateToString("HH:mm",this.activeplan.startwarntime);

    temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.activeplan.wakeup);
    this.activeplan.wakeuptime = new Date(temptime);
    this.selecttime.wakeup=this.va.DateToString("HH:mm",this.activeplan.wakeuptime);


    temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.activeplan.wakeupwarn);
    this.activeplan.wakeupwarntime = new Date(temptime);
    this.selecttime.wakeupwarn=this.va.DateToString("HH:mm",this.activeplan.wakeupwarntime);

    console.log("this.activeplan  : ----- ", this.activeplan);
    this.onperiod = this.checkperiod();

    this.setplancode();

  }

  routechange(){
    // console.log("Selectedroute selectrout : ", this.selectrout);    
    this.activeplan.setdatabyroute(this.selectrout);
    this.selecttime.end = this.va.DateToString("HH:mm",this.activeplan.endtime);
    this.setplancode();
    // console.log("Selectedroute this.activeplan : ", this.activeplan);    

    // console.log("this.selecttime.end : ----- ", this.selecttime.end);
  }
  setplancode(){
    if(this.activeplan.plantype>1 && !this.editplan){
      this.activeplan.routeday=this.activeplan.plandate.getDay()
      this.activeplan.plancode = this.va.DateToString("yyyyMMddHHmm",this.activeplan.starttime)+"-"+this.activeplan.routeid+"-"+this.activeplan.vid
      // console.log("this.activeplan.plancode ",this.activeplan.plancode);
    }

  }
  //===================================================================
  // #region  =========== Get data for list ===========================

  async getrouteData() {
    var result: RouteModel[] = [];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'routecomp', compid: this.company.id };
      var jsondata = await this.va.getwsdata(wsname, params);
      if (jsondata.code == "000") {      
        jsondata.data.forEach((data: any) => {
          var temp = new RouteModel();
          temp.setdata(data);
          result.push(temp);
        });
        this.showSanckbar("get routedata success",2);
      } else {
        this.showSanckbar("get routedata fails"+ jsondata.message,2);
      }  
    }catch(ex){
      this.showSanckbar("get routedata error"+ ex,2);
    }
    return result;

  }

  async getshiftData() {
    var result: ComshiftModel[] = [];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'dllshift', compid: this.company.id };
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("getshiftData jsondata: ",jsondata);

      if (jsondata.code == "000") {      
        jsondata.data.forEach((data: any) => {
          var temp = new ComshiftModel(data);
          result.push(temp);
        });
        this.showSanckbar("getshiftData success",2);
      } else {
        this.showSanckbar("getshiftData fails"+ jsondata.message,2);
      }  
    }catch(ex){
      this.showSanckbar("getshiftData error"+ ex,2);
    }
    if(result.length>0){this.selectshift=result[0];}
    return result;
  }

  async getunplanvehicle() {
    var result: VehicleModel[] = [];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'unplanvehicle', starttime: this.activeplan.wakeupwarntime,endtime:this.activeplan.endtime};
      var jsondata = await this.va.getwsdata(wsname, params);
      if (jsondata.code == "000") {      
        jsondata.data.forEach((data: any) => {
          var temp = new VehicleModel(data);
          result.push(temp);
        });
        this.showSanckbar("get getunplanvehicle success",2);
      } else {
        this.showSanckbar("get getunplanvehicle fails"+ jsondata.message,2);
      }  
    }catch(ex){
      this.showSanckbar("get getunplanvehicle error"+ ex,2);
    }
    return result;

  }

  

  // #endregion  =========== getdata for dll list =====================
  //===================================================================


  //===================================================================
  // #region  =========== Save & Update Plan ==========================

  async saveplan(){
    this.setplancode();
    // console.log("this.activeplan : ",this.activeplan);
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลนี้หรือไม่");
      if(confirm=="true"){
        if(await this.saveupdateplan()){
            this.talk.emit(this.activeplan);
            this.modal.close();
        }else{this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")}
      }
    }catch(ex){
      // console.log("save plan error ",ex)
      this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }

  async saveupdateplan(){
    try{
      var tbname =["route","","routeweek","driverplan"];
      var wsname = "updatedata";
      var data = new  RouteplanModel(this.activeplan);
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname[this.activeplan.plantype],data:data})
      if(jsondata.code=="000"){
        this.showSanckbar("save or updateplan success",2);
        return true;
      }
    }catch(ex){
      // console.log("saveupdateplan Error : ",ex)
      this.showSanckbar("save or updateplan error" + ex,2);
    }
    return false;
  }

  async deleteplan(){
    try{
      var confirm =await this.OkCancelMessage("ยืนยันการลบ","คุณต้องการลบข้อมูลนี้หรือไม่");
      if(confirm=="true"){
        if(await this.setdeleteplan()){
            this.talk.emit(this.activeplan);
            this.modal.close();
        }else{this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง1");}
      }
    }catch(ex){
      console.log("deleteplan error ",ex);
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง2");
    }
  }

  async setdeleteplan(){
    try{
      var tbname =["route","","routeweek","driverplan"];
      var wsname = "deldata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname[this.activeplan.plantype],plancode:this.activeplan.plancode})
      if(jsondata.code=="000"){
        this.showSanckbar("delete plan success",2);
        return true;
      }
    }catch(ex){
      this.showSanckbar("delete plan Error" + ex,2);
      console.log("setdeleteplan Error : ",ex)
    }
    return false;
  }

  async updatevehicleinplan(data:any){
    try{
      var wsname = "updatedata";
      var param = {tbname:"vehicleinplan",vid:data.vid,driverid:data.driverid,plancode:data.plancode}
      var jsondata = await this.va.getwsdata(wsname,param);
      if(jsondata.code=="000"){
        this.showSanckbar("save or updateplan success",2);
        return true;
      }
    }catch(ex){
      // console.log("saveupdateplan Error : ",ex)
      this.showSanckbar("update vehicle in plan error" + ex,2);
    }
    return false;
  }

  // #endregion  =========== Save & Update Plan =======================
  //===================================================================


  //===================================================================
  // #region  =========== Edit vehicle & Driver =======================

  async editvehicle(modal :any,showvehicle:boolean ){
    this.show.Spinner=true;
    this.show.vehicle = showvehicle;
    this.unplanvehicle = await  this.getunplanvehicle();
    if(showvehicle){
      this.showunplanvehicle= this.unplanvehicle ;
    }else{
      this.showunplanvehicle= this.unplanvehicle.filter(x=>x.fullname.trim()!='');
    }
    this.selectmodal = this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
    this.show.Spinner=false;
  }
  filtervehicle(){
    if(this.show.vehicle) {
      this.showunplanvehicle= this.unplanvehicle.filter(x=>x.vlicent.includes(this.show.keyword));
    }
    else{
      this.showunplanvehicle= this.unplanvehicle.filter(x=>x.fullname.trim()!=''&&(x.drivername.includes(this.show.keyword)||x.driverphone.includes(this.show.keyword)));
    }
    if(this.showunplanvehicle.length>0){this.selectvehicle=this.showunplanvehicle[0];}
  }
  async confirmSelection(){
    try{
      if(this.selectvehicle){
        var data ={
          vid:this.show.vehicle?this.selectvehicle.vid:this.activeplan.vid,
          driverid:this.selectvehicle.driverid,
          plancode:this.activeplan.plancode
        }
        var result = await this.updatevehicleinplan(data);
        if(result){
          if(this.show.vehicle){
            this.activeplan.vid =this.selectvehicle.vid;
            this.activeplan.vlicent =this.selectvehicle.vlicent;
            this.activeplan.vname =this.selectvehicle.vname;
            this.activeplan.driverid =this.selectvehicle.driverid;
            this.activeplan.driverimage =this.selectvehicle.driverimage;
            this.activeplan.drivername =this.selectvehicle.fullname;
            this.activeplan.driverphone =this.selectvehicle.driverphone;
          }
          else{
            this.activeplan.driverid =this.selectvehicle.driverid;
            this.activeplan.driverimage =this.selectvehicle.driverimage;
            this.activeplan.drivername =this.selectvehicle.fullname;
            this.activeplan.driverphone =this.selectvehicle.driverphone;
          }
          // console.log("this.selectmodal :", this.selectmodal);
          if (this.selectmodal) { 
            this.selectmodal.close(); 
            this.selectmodal = null;
            this.talk.emit(this.activeplan);
            this.modal.close();
          }

        }
      }
  
    }catch(ex){console.log("confirmSelection error :", ex)}
  }

  // #endregion  =========== Edit vehicle & Driver ====================
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
