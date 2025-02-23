import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DialogpageComponent,DialogConfig} from '../../../material/dialogpage/dialogpage.component';
import { VehicleModel,RouteModel,RouteplanModel,Calendarslot, CalendarplanModel} from '../../../models/datamodule.module';

@Component({
  selector: 'app-selectvehicleplanpage',
  templateUrl: './selectvehicleplanpage.component.html',
  styleUrls: ['./selectvehicleplanpage.component.scss'],
})
export class SelectvehicleplanpageComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public va: variable,
    private snacbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  @Input() modal: any;
  @Input() workslot: CalendarplanModel | undefined;
  @Input() route: RouteModel | undefined;

  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  show = { Spinner: true, step: 0 };
  keyword = '';
  public activevihicle: VehicleModel = new VehicleModel();
  public selectedvid: number = 0;
  public listslot: Calendarslot[] = [];

  public listvehicle: VehicleModel[] = [];
  showvehicle: VehicleModel[]=[];

  async ngOnInit() {
    this.listvehicle = await this.getallvehicle();
    this.show.Spinner = false;
    // console.log('workslot : ', this.workslot);
  }
 
  async inputchange(){
    this.show.Spinner = true;
      //  console.log('keyword : ', this.keyword);
    this.showvehicle = this.filtervehicle(this.keyword);
    this.show.Spinner = false;
  }

  filtervehicle(value:string):VehicleModel[]{
    const filterValue = this.keyword.toLowerCase();
    var result = this.listvehicle.filter(item => item.vname.toLowerCase().includes(filterValue));
    if(!result){result=[]}
    return result;

  }



  async getallvehicle() {
    var result: VehicleModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'vehicle', keyword: this.keyword };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("searchvehicle jsondata : ", jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new VehicleModel(data);
        result.push(temp);
      });
    } else {
    }
    // console.log("searchvehicle result : ", result);
    return result;
  }

  async searchvehicle() {
    // console.log("showvehicle ",this.showvehicle);
    this.show.Spinner = true;
    this.listvehicle = await this.getlistvehicle();
    if (this.listvehicle.length > 0) {
      this.activevihicle = this.listvehicle[0];
      this.selectedvid = this.activevihicle.vid;
    }
    this.show.Spinner = false;
  }

  async getlistvehicle() {
    this.keyword = this.keyword.trim();
    var result: VehicleModel[] = [];
    if (this.keyword.length > 2) {
      var wsname = 'getdata';
      var params = { tbname: 'vehicle', keyword: this.keyword };
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("searchvehicle jsondata : ", jsondata);
      if (jsondata.code == '000') {
        jsondata.data.forEach((data: any) => {
          var temp = new VehicleModel(data);
          result.push(temp);
        });
      } else {
      }
    } else {
      this.alertMessage('แจ้งเตือน', 'กรุณาระบุ Keyword อย่างน้อย 3 ตัว');
    }
    // console.log("searchvehicle result : ", result);
    return result;
  }

  showvehicledetail(vehicle: VehicleModel) {
    this.activevihicle = vehicle;
    this.selectedvid = vehicle.vid;
  }

  async showvehicleslot() {
    // console.log('workslot : ',this.workslot);
    // if(workslot?.)
    var listwork = await this.getWeekData();
    if(listwork){
      // console.log('listwork : ', listwork);
      this.listslot = [];
      if(listwork.length>0){
        this.listslot = this.setworkslot(listwork)
      }else{
        //ไม่มีงาน
        // console.log('this.workslot : ', this.workslot);
        this.listslot = this.setemptyworkslot();
      }
    }
  }

  setworkslot(listwork:RouteplanModel[]){
    var result : Calendarslot[] = [];
    try{
        var lastendtime = new Date(listwork[0].starttime);
        lastendtime.setMinutes(lastendtime.getMinutes()-listwork[0].wakeupwarn);
        // var lastendtime = new Date(listwork[0].starttime);
        var nextday = new Date(
          lastendtime.getFullYear(),lastendtime.getMonth(),lastendtime.getDate(),0,0,0,0);
        var lastendtime = new Date(nextday);
        nextday.setDate(nextday.getDate() + 1);
  
        for (var i = 0; i < listwork.length; i++) {
          var plan = listwork[i];
          var planstart = new Date(plan.starttime);
          planstart.setMinutes(planstart.getMinutes()-plan.wakeupwarn);
          //เช็คว่า plan.starttime != lastendtime
          if (lastendtime != planstart) {
            //สร้าง slot ว่างตั้งแต่เที่งคือน ถึงเรื่มงานแรก
            var period = this.va.getperiodinminutes(planstart, lastendtime);
            var emptyslot = this.getslotplan({starttime: lastendtime,endtime: planstart,period: period,plancode: '',plantype: 2, routename:'ว่าง'});
            result.push(emptyslot);
          }
          // if (lastendtime != plan.starttime) {
          //   //สร้าง slot ว่างตั้งแต่เที่งคือน ถึงเรื่มงานแรก
          //   var period = this.va.getperiodinminutes(plan.starttime, lastendtime);
          //   var emptyslot = this.getslotplan({starttime: lastendtime,endtime: plan.starttime,period: period,plancode: '',plantype: 2, routename:'ว่าง'});
          //   result.push(emptyslot);
          // }
          //สร้าง slot ว่างตั้งแต่ lastendtime ถึง planstarttime
  
          //สร้าง slot ของงานที่มี ตั้งแต่ plan.starttime จนถึง plan.endtime
          var slotplan:RouteplanModel = new RouteplanModel(plan);
          slotplan.starttime = planstart;
          var slot = this.getslotplan(slotplan);
          // var slot = this.getslotplan(plan);
          result.push(slot);
          //เก็บ plan.endtime ไว้ที่ lastendtime;
          lastendtime = new Date(plan.endtime);
        }
  
        if (lastendtime != nextday) {
          var plan = listwork[listwork.length-1];
          var period = this.va.getperiodinminutes(lastendtime, nextday);
          var data = {starttime: lastendtime,endtime: nextday,period: period,plancode: '',plantype: 2, routename:'ว่าง'}
          var emptyslot = this.getslotplan(data);
          result.push(emptyslot);
        }

        var lastslot = result[result.length-1];
        lastslot.endid=(Math.floor(1440/this.va.calendarperiod))
      // console.log('result : ', result);
        this.show.step = 1;
      
    }catch(ex){ console.log('setworkslot : error : ', ex);}
    return result;
  }
  setemptyworkslot(){
    var result : Calendarslot[] = [];
    try{
      if(this.workslot){
        var lastendtime =  new Date(this.workslot.cdate);
        var nextday = new Date(lastendtime);
        nextday.setDate(nextday.getDate()+1);
        var period = this.va.getperiodinminutes(lastendtime,nextday);
        var emptyslot = this.getslotplan({starttime: lastendtime,endtime: nextday,period: period,plancode: '',plantype: 2, routename:'ว่าง'});
        emptyslot.endid=(Math.floor(1440/this.va.calendarperiod))
        result.push(emptyslot);
      }
      // console.log('result : ', result);
      this.show.step = 1;
      
    }catch(ex){ console.log('setworkslot : error : ', ex);}
    return result;
  }

  getslotplan(plan: any) {
    var result = new Calendarslot();
    try{
      result.sdate = plan.starttime;
      result.edate = plan.endtime;
      result.period = plan.period;
      result.dayname = plan.routename;
      result.showdate = this.va.DateToString('dd-MM-yyyy', plan.starttime);
      result.starttime = this.va.DateToString('HH:mm', plan.starttime);
      result.endtime = this.va.DateToString('HH:mm', plan.endtime);
      result.plancode = plan.plancode;
      result.plantype = plan.plantype;
      result.startid = this.va.getperiodid(plan.starttime);
      result.endid =  this.va.getperiodid(plan.endtime);
    }catch(ex){console.log('getslotplan : error : ', ex);}
    return result;
  }

  async getWeekData() {
    try{
      var result: RouteplanModel[] = [];
      var wsname = 'getdata';
      var params = {
        tbname: 'routeweek',
        vid: this.activevihicle.vid,
        routeday: this.workslot?.id,
      };
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log('getWeekData jsondata : ', jsondata);
      if (jsondata.code == '000') {
        if(jsondata.data.length>0){
          // มีงานบ้างแล้ว
          jsondata.data.forEach((data: any) => {
            var temp = new RouteplanModel(data);
            // temp.setdata(data);
            result.push(temp);
          });  
        }else{
          // ยังไม่มีงานเลย
         
        }
      } else {
        alert('getWeekData No data');
        return undefined;
      }
      // console.log('getWeekData result : ', result);
      return result;
  
    }catch(ex){
      console.log("getWeekData Error : " ,ex);
      return undefined;
    }
  }
  async getPlanData() {
    try{
      var result: RouteplanModel[] = [];
      var wsname = 'getdata';
      var params = {
        tbname: 'planday',
        vid: this.activevihicle.vid,
        plankey: this.workslot?.id,
      };
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log('getWeekData jsondata : ', jsondata);
      if (jsondata.code == '000') {
        if(jsondata.data.length>0){
          // มีงานบ้างแล้ว
          jsondata.data.forEach((data: any) => {
            var temp = new RouteplanModel(data);
            // temp.setdata(data);
            result.push(temp);
          });  
        }else{
          // ยังไม่มีงานเลย
         
        }
      } else {
        alert('getWeekData No data');
        return undefined;
      }
      // console.log('getWeekData result : ', result);
      return result;
  
    }catch(ex){
      console.log("getWeekData Error : " ,ex);
      return undefined;
    }
  }


  showcreateplan(slot:Calendarslot){
    // console.log('slot',slot);
    // console.log('this.activevihicle',this.activevihicle);

    if(slot.plancode==""){
      slot.dayname = (this.workslot?this.workslot.textdate:"");
      var returndata = {slot:slot,vehicle:this.activevihicle}
      this.talk.emit(returndata);
      this.modal.close();
    }
  }

  // ===== Message Dialog ====================
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
}
