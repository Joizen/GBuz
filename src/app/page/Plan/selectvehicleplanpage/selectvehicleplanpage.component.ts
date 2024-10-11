import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';
import {
  DialogpageComponent,
  DialogConfig,
} from '../../../material/dialogpage/dialogpage.component';
import {
  Vehicledata,
  Companydata,
  Routedata,
  Routeplandata,
  Calendarslot,
  Calendarplan,
} from '../../../models/datamodule.module';

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
  @Input() workslot: Calendarplan | undefined;
  @Input() route: Routedata | undefined;

  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  show = { Spinner: true, step: 0 };
  keyword = '';
  public listvehicle: Vehicledata[] = [];
  public activevihicle: Vehicledata = new Vehicledata();
  public selectedvid: number = 0;
  public listslot: Calendarslot[] = [];

  ngOnInit(): void {
    this.show.Spinner = false;
    console.log('workslot : ', this.workslot);
  }

  async searchvehicle() {
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
    var result: Vehicledata[] = [];
    if (this.keyword.length > 2) {
      var wsname = 'getdata';
      var params = { tbname: 'vehicle', keyword: this.keyword };
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("searchvehicle jsondata : ", jsondata);
      if (jsondata.code == '000') {
        jsondata.data.forEach((data: any) => {
          var temp = new Vehicledata();
          temp.setdata(data);
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

  showvehicledetail(vehicle: Vehicledata) {
    this.activevihicle = vehicle;
    this.selectedvid = vehicle.vid;
  }

  async showvehicleslot() {
    console.log('showvehicleslot : ');

    var listwork = await this.getWeekData();
    console.log('listwork : ', listwork);

    this.listslot = [];
    if(listwork.length>0){this.listslot = this.setworkslot(listwork)}
  }

  setworkslot(listwork:Routeplandata[]){
    var result : Calendarslot[] = [];
    try{
        var lastendtime = new Date(listwork[0].starttime);
        var nextday = new Date(
          lastendtime.getFullYear(),lastendtime.getMonth(),lastendtime.getDate(),0,0,0,0);
        var lastendtime = new Date(nextday);
        nextday.setDate(nextday.getDate() + 1);
  
        for (var i = 0; i < listwork.length; i++) {
          var plan = listwork[i];
          //เช็คว่า plan.starttime != lastendtime
          if (lastendtime != plan.starttime) {
            //สร้าง slot ว่างตั้งแต่เที่งคือน ถึงเรื่มงานแรก
            var period = this.va.getperiodinminutes(plan.starttime, lastendtime);
            var emptyslot = this.getslotplan({starttime: lastendtime,endtime: plan.starttime,period: period,plancode: '',plantype: 2, routename:'ว่าง'});
            result.push(emptyslot);
          }
          //สร้าง slot ว่างตั้งแต่ lastendtime ถึง planstarttime
  
          //สร้าง slot ของงานที่มี ตั้งแต่ plan.starttime จนถึง plan.endtime
          var slot = this.getslotplan(plan);
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
  
        console.log('result : ', result);
        this.show.step = 1;
      
    }catch(ex){ console.log('setworkslot : error : ', ex);}
    return result;
  }

  getslotplan(plan: any) {
    var result = new Calendarslot();
    try{
      // temp.startid = plan.startid;
      // temp.endid = plan.endid;
      result.sdate = plan.starttime;
      result.edate = plan.endtime;
      result.period = plan.period;
      result.dayname = plan.routename;
      result.showdate = this.va.DateToString('dd-MM-yyyy', plan.starttime);
      result.starttime = this.va.DateToString('HH:mm', plan.starttime);
      result.endtime = this.va.DateToString('HH:mm', plan.endtime);
      result.plancode = plan.plancode;
      result.plantype = plan.plantype;
    }catch(ex){console.log('getslotplan : error : ', ex);}
    return result;
  }

  async getWeekData() {
    var result: Routeplandata[] = [];
    var wsname = 'getdata';
    var params = {
      tbname: 'routeweek',
      vid: this.activevihicle.vid,
      routeday: this.workslot?.id,
    };
    var jsondata = await this.va.getwsdata(wsname, params);
    console.log('getWeekData jsondata : ', jsondata);
    if (jsondata.code == '000') {
      jsondata.data.forEach((data: any) => {
        var temp = new Routeplandata();
        temp.setdata(data);
        result.push(temp);
      });
    } else {
      alert('getWeekData No data');
    }
    console.log('getWeekData result : ', result);
    return result;
  }

  showcreateplan(slot:Calendarslot){
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
