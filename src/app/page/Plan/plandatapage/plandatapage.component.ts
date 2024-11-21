import { Component,Input,EventEmitter, Output, OnInit    } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  show = {Spinner: true};
  routelist: RouteModel[] = [];
  selectrout : RouteModel = new RouteModel();
  selectshift : ComshiftModel = new ComshiftModel();
  selecttime={start:"00:00", end : "00:00"} ; 
  activeplan : RouteplanModel =new RouteplanModel();
  public listshift : ComshiftModel []= [];
  
  onperiod=false;


  async ngOnInit() {
    try{
      
      console.log("ngOnInit this.routedata 1",this.routedata);
      
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
        
      }else{
        this.listshift = await this.getshiftData();
        await this.createnewplan();
      } 
      if(this.routedata){
        this.selectrout = this.routedata;
      }
      console.log("ngOnInit this.editplan ",this.editplan);
      console.log("ngOnInit this.routedata ",this.routedata);
      console.log("ngOnInit this.selectrout ",this.selectrout);
      console.log("ngOnInit this.activeplan ",this.activeplan);
      

    }catch(ex){console.log("ngOnInit error : ", ex); }
    this.onperiod = this.checkperiod();
    this.show.Spinner=false;  
  }

  checkperiod(){
    console.log('this.activeplan.starttime',this.activeplan.starttime);
    console.log('this.activeplan.endtime',this.activeplan.endtime);
    console.log('this.planslot.sdate',this.planslot.sdate);
    console.log('this.planslot.edate',this.planslot.edate);
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
          this.activeplan.vlince = this.vehicle.vlicent;
          this.activeplan.vname = this.vehicle.vname;
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
      console.log("getshiftData jsondata: ",jsondata);

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

  setoptionchange(event: Event,type:number){
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    if(type==0){ this.activeplan.routetypename = selectedText; }
    else if(type==1){ this.activeplan.shiftname= selectedText; }
    else if(type==2){ this.activeplan.otname= selectedText; }
    this.shiftchange();

  }
  shiftchange(){
    console.log("Selectedshift : ", this.selectshift);    
    this.activeplan.shiftid = this.selectshift.id;
    // ปรับ เวลาตาม shipf ที่เลือก
    if(this.activeplan.issend==0){ // ถ้ารับเข้าบริษัท
      // ปรับเวลาส่ง ให้เป็นไปตามเวลาส่งตามกะ      
      this.selecttime.end = this.va.DateToString("HH:mm",this.selectshift.sendtime);
      // ไม่ต้องเลือก OT
      this.activeplan.ot=0;
      this.activeplan.otname="ปกติ";
      this.activeplanchange();
    }
    else{ // ถ้าส่งกลับบ้าน
      // ปรับเวลาส่งสุดท้ายให้เป็น เวลารับต้นทางตาม OT + period       
      if(this.activeplan.ot==0){
      this.selecttime.start = this.va.DateToString("HH:mm",this.selectshift.receivetime);
      }
      else{
        this.selecttime.start = this.va.DateToString("HH:mm",this.selectshift.ottime);
      }
      this.activeplanchange();
    }

   

  }
  activeplanchange(){
    var index = this.activeplan.issend;
    console.log("selecttime.index : ",index);
    if(index==0){
      // เปลี่ยนเวลาถึงปลายทาง
      console.log("selecttime.end : ",this.selecttime.end);
      const [hours, minutes] = this.selecttime.end.split(':').map(Number); 
      this.activeplan.endtime.setHours(hours, minutes);

      var starttime = new Date(this.activeplan.endtime);
      starttime.setMinutes(starttime.getMinutes()-this.activeplan.period);
      this.activeplan.starttime= new Date(starttime);

    }else if(index==1){
      // เปลี่ยนเวลาเริ่มต้นทาง
      console.log("selecttime.start : ",this.selecttime.start);
      const [hours, minutes] = this.selecttime.start.split(':').map(Number); 
      this.activeplan.starttime.setHours(hours, minutes);

      var endtime = new Date(this.activeplan.starttime);
      endtime.setMinutes(endtime.getMinutes()+this.activeplan.period);
      this.activeplan.endtime= new Date(endtime);
    }


    var starttime = new Date(this.activeplan.starttime);
    // starttime.setMinutes(starttime.getMinutes()-this.activeplan.period);
    // this.activeplan.starttime= new Date(starttime);

    var temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.activeplan.startwarn);
    this.activeplan.startwarntime = new Date(temptime);

    temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.activeplan.wakeup);
    this.activeplan.wakeuptime = new Date(temptime);

    temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.activeplan.wakeupwarn);
    this.activeplan.wakeupwarntime = new Date(temptime);
    console.log("this.activeplan  : ----- ", this.activeplan);
    this.onperiod = this.checkperiod();

    this.setplancode();
  }


  routechange(){
    // console.log("Selectedroute selectrout : ", this.selectrout);    
    this.activeplan.setdatabyroute(this.selectrout);
    this.selecttime.end = this.va.DateToString("HH:mm",this.activeplan.endtime);
    this.setplancode();
    console.log("Selectedroute this.activeplan : ", this.activeplan);    

    // console.log("this.selecttime.end : ----- ", this.selecttime.end);
  }

  setplancode(){
    if(this.activeplan.plantype>1 && !this.editplan){
      this.activeplan.routeday=this.activeplan.plandate.getDay()
      this.activeplan.plancode = this.va.DateToString("yyyyMMddHHmm",this.activeplan.starttime)+"-"+this.activeplan.routeid+"-"+this.activeplan.vid
      console.log("this.activeplan.plancode ",this.activeplan.plancode);
    }

  }


  async saveplan(){
    this.setplancode();
    console.log("this.activeplan : ",this.activeplan);
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลนี้หรือไม่");
      if(confirm=="true"){
        if(await this.saveupdateplan()){
            this.talk.emit(this.activeplan);
            this.modal.close();
        }else{this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")}
      }
    }catch(ex){
      console.log("save plan error ",ex)
      this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }

  async saveupdateplan(){
    try{
      var tbname =["route","","routeweek","driverplan"];
      var wsname = "updatedata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname[this.activeplan.plantype],data:this.activeplan})
      if(jsondata.code=="000"){
        this.showSanckbar("save or updateplan success",2);
        return true;
      }
    }catch(ex){
      console.log("saveupdateplan Error : ",ex)
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
      console.log("OkCancelMessage error ",ex);
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


  // ===== Message Dialog ====================

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

}
