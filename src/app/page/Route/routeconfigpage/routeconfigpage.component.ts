import { Component,Input,EventEmitter, Output, OnInit } from '@angular/core';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {RouteModel,CompanyModel} from '../../../models/datamodule.module'
import { variable } from 'src/app/variable';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-routeconfigpage',
  templateUrl: './routeconfigpage.component.html',
  styleUrls: ['./routeconfigpage.component.scss']
})
export class RouteconfigpageComponent implements OnInit {
  @Input() modal: any;
  @Input() activedata : RouteModel = new RouteModel();
  @Input() company : CompanyModel = new CompanyModel();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  show = {Spinner: true,save:false,endtime:"08:00"};
  editroute : RouteModel = new RouteModel();

  constructor(
    private modalService: NgbModal,public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if(this.activedata){this.editroute = new RouteModel(this.activedata); }
    // console.log("this.editroute ",this.editroute);
    // console.log("this.activedata ",this.activedata);
    this.show.endtime = this.va.DateToString("HH:mm",this.editroute.endtime); 
    // this.editroute.ownerid =this.company.id;
    this.show.Spinner= false;
  }
  activeplanchange(){
    // เปลี่ยนเวลาถึงปลายทาง
    // console.log("selecttime.end : ",this.show.endtime);
    const [hours, minutes] = this.show.endtime.split(':').map(Number); 
    this.editroute.endtime.setHours(hours, minutes);

    var starttime = new Date(this.editroute.endtime);
    starttime.setMinutes(starttime.getMinutes()-this.editroute.period);
    this.editroute.starttime= new Date(starttime);

    var temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.editroute.startwarn);
    this.editroute.startwarntime = new Date(temptime);

    temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.editroute.wakeup);
    this.editroute.wakeuptime = new Date(temptime);

    temptime = new Date(starttime);
    temptime.setMinutes(temptime.getMinutes()-this.editroute.wakeupwarn);
    this.editroute.wakeupwarntime = new Date(temptime);

  }
  routenamechang(){
    // console.log("this.editroute ",this.editroute);
    this.show.save =this.checksave();
    // console.log("this.show.save ",this.show.save);
  }
  checksave(){
    if(this.editroute.routename.trim()==""){return false;}
    if(this.editroute.period==0){return false;}
    if(this.editroute.wakeupwarn==0){return false;}
    if(this.editroute.wakeup==0 ||this.editroute.wakeup>this.editroute.wakeupwarn){return false;}
    if(this.editroute.startwarn==0||this.editroute.startwarn>this.editroute.wakeupwarn){return false;}
    return true;
  }

  async saveroute(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลนี้หรือไม่");
      if(confirm=="true"){
        if(await this.saveupdateroute()){
            this.talk.emit(this.editroute);
            this.modal.close();
        }else{this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")}
      }
    }catch(ex){
      console.log("save route error ",ex)
      this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }

  async saveupdateroute(){
    try{
      var wsname = "updatedata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:"route",data:this.editroute})
      if(jsondata.code=="000"){
        this.showSanckbar("save or update route success",2);
        return true;
      }
    }catch(ex){
      console.log("saveupdateplan Error : ",ex)
      this.showSanckbar("save or update  route error" + ex,2);
    }
    return false;
  }


  async deleteroute(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการลบ","คุณต้องการลบข้อมูลนี้หรือไม่");
      if(confirm=="true"){
        this.editroute.transtatus=-3;
        if(await this.saveupdateroute()){
            this.talk.emit(this.editroute);
            this.modal.close();
        }else{this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")}
      }
    }catch(ex){
      console.log("delete route error ",ex)
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }

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
