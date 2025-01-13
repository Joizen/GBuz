import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { variable, getCalendarPeriod } from '../variable';

import * as va from '../variable';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})



export class DatamoduleModule { }

export class SelecteddataModel {
  id:number = -1;
  display: string = "ไม่ระบุ";
  ref1: string = "";
  ref2: string = "";
  ref3: string = "";
  ref4: string = "";
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any) {
    if(jsondata){
      this.id = jsondata.id;
      this.display = jsondata.display;
      if(jsondata.ref1){this.ref1 = jsondata.ref1};
      if(jsondata.ref2){this.ref2 = jsondata.ref2};
      if(jsondata.ref3){this.ref3 = jsondata.ref3};
      if(jsondata.ref4){this.ref4 = jsondata.ref4};
    }
   }
}
export class PagekeyModel {
  cid: string;
  apistime: string;
  constructor(cid: string, apistime: string) {
    this.cid = cid;
    this.apistime = apistime;
  }
}
export class ProfileModel {
  constructor() { }
  empcode : string = "";
  empname : string = "";
  linename : string = "";
  userimage : string = "";
  phone : string = "";
  companyname : string = "";
  rolename : string = "";
  remark : string = "";
  transtatus : number = 1;
  setData(jsondata: any) {
    // console.log('setData jsondata : ', jsondata);
    this.empcode = jsondata.empcode; 
    this.empname = jsondata.empname; 
    this.linename = jsondata.linename; 
    this.userimage = jsondata.userimage; 
    this.phone = jsondata.phone; 
    this.companyname = jsondata.companyname; 
    this.rolename = jsondata.rolename; 
    this.remark = jsondata.remark; 
    this.transtatus = jsondata.transtatus; 
  }
}
export class UserModel {
  id:number=0;
  empcode : string = "";
  empname : string = "";
  prefix : string = "นาย";
  firstname : string = "";
  surename : string = "";
  linename : string = "";
  userimage : string = "";
  phone : string = "";
  companyname : string = "";
  rolename : string = "";
  remark : string = "";
  transtatus : number = 1;
  selectcomp:number=3;
  selectrole:number=20;
  isselect:boolean=false;
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any) {
    if(jsondata){
      // console.log('setData jsondata : ', jsondata);
      this.id = jsondata.id;
      this.empcode = jsondata.empcode; 
      this.empname = jsondata.empname; 
      this.linename = jsondata.linename; 
      this.userimage =  jsondata.userimage==""?"assets/images/user.png":jsondata.userimage; 
      this.phone = jsondata.phone; 
      this.companyname = jsondata.companyname; 
      this.rolename = jsondata.rolename; 
      this.transtatus = jsondata.transtatus; 
      this.prefix = jsondata.prefix;
      this.firstname = jsondata.firstname;
      this.surename = jsondata.surename;
      this.remark= jsondata.remark;
    }
  }
}
export class privilegeModel {
  id:number=0;
  pageid:number=0;
  controlid:number=-0;
  pagename:string="";
  controlname:string="";
  description :string="";
  constructor() { }
  setdata(jsondata: any) {
    this.id = jsondata.id;
    this.pageid = jsondata.pageid;
    this.controlid = jsondata.controlid;
    this.pagename = jsondata.pagename;
    this.controlname = jsondata.controlname;
    this.description = jsondata.description;
  } 
}


// ============= Main Dashboar  ==================

//#region for smart control dashboard
export class DashboardcompanyModel {
  cid: number = 0;
  company: string = "";
  comadmin: string = "";
  complogo: string = "";
  phone: string = "";
  totaltemp: number = 0;
  totaldrop: number = 0;
  totalemp: number = 0;
  totalroute: number = 0;
  totalvehicle: number = 0;
  totaldo: number = 0;
  totalwake: number = 0;
  totalalc: number = 0;
  totalstart: number = 0;
  totalotw: number = 0;
  totalfinish: number = 0;
  dolist:DashboardplanModel[]=[];
  showdetail: boolean = false;
  showgroup: boolean[] = [true, true, true, true, true];
  get groupunwakeup() { return this.dolist.filter(item => item.laststatus<5); }
  get groupwakeup() { return this.dolist.filter(item => item.laststatus==5); }
  get groupalc() { return this.dolist.filter(item => item.laststatus==10); }
  get groupstart() { return this.dolist.filter(item => item.laststatus==20); }
  get groupotw() { return this.dolist.filter(item => item.laststatus==25); }
  get groupfinish() { return this.dolist.filter(item => item.laststatus==30); }
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any) { 
    if(jsondata){
      this.cid = jsondata.id;
      this.company = jsondata.companyname;
      this.comadmin = jsondata.contract;
      this.complogo = jsondata.complogo;
      this.phone = jsondata.phone;
      this.totaltemp = jsondata.totaltemp;
      this.totaldrop = jsondata.totaldrop;
      this.totalemp = jsondata.totalemp;
      this.totalroute = jsondata.totalroute;
      this.totalvehicle = jsondata.totalvehicle;  
    }
  }
}
export class DashboardplanModel {
  cid: number = 0;
  companyname: string = "";
  complogo: string = "";
  docode: string = "";
  plankey: string = "";
  plandate:Date = new Date();
  vid: number = 0;
  vname: string = "";
  vlicent: string = "";
  serialbox: string = "";
  driverid: number = 0;
  fullname: string = "";
  phone: string = "";
  mobile: string = "";
  linename: string = "";
  lineimage: string = "";
  routeid: number = 0;
  routename: string = "";
  issend: number = 0;
  isendname: string = "";
  ot: number = 0;
  otname: string = "";
  shifid: number = 0;
  shift: string = "";
  distance: number = 0;
  starttime:Date = new Date("2000-01-01 00:00:00");
  startact:Date = new Date("2000-01-01 00:00:00");
  period: number = 0;
  finishtime:Date = new Date("2000-01-01 00:00:00");
  finishact:Date = new Date("2000-01-01 00:00:00");
  wakeupwarn: number = 0;
  wakeupworntime:Date = new Date("2000-01-01 00:00:00");
  wakeup: number = 0;
  wakeuptime:Date = new Date("2000-01-01 00:00:00");
  wakeupact:Date = new Date("2000-01-01 00:00:00");
  startwarn: number = 0;
  startwarntime:Date = new Date("2000-01-01 00:00:00");
  startwarnact:Date = new Date("2000-01-01 00:00:00");
  alcstatus: number = 0;
  alcvalue: number = 0;
  acltime:Date = new Date("2000-01-01 00:00:00");
  listactivity:PlanactivityModel[] =[];
  laststatus: number = 0;
  laststatuscolor: string = "#FFFFFF";
  laststatusname: string = "";
  laststatuswarn: Date = new Date("2000-01-01 00:00:00");
  laststatustaget: Date = new Date("2000-01-01 00:00:00");
  laststatustime: Date = new Date("2000-01-01 00:00:00");
  laststatuslevel: number = 0;
  modifieddate: Date = new Date("2000-01-01 00:00:00");
  vlat: number = 0.0;
  vlng: number = 0.0;
  vstatus: number = 0.0;
  vstatuscorlor: string = "#d6d4d4"
  vstatusname: string = "";
  vlocation: string = "";
  vlocationcode: string = "";
  vspeed: number = 0;
  vheader: number = 0;
  vio: string = "";
  lastlat: number = 0.0;
  lastlng: number = 0.0;
  gpstime: Date = new Date("2000-01-01 00:00:00");

  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any) { 
    if(jsondata){
      this.cid = jsondata.cid;
      this.companyname = jsondata.companyname;
      this.docode = jsondata.docode;
      this.plankey = jsondata.plankey;
      this.vid = jsondata.vid;
      this.vname = jsondata.vname;
      this.vlicent = jsondata.vlicent;
      this.serialbox = jsondata.serialbox;
      this.driverid = jsondata.driverid;
      this.fullname = jsondata.fullname;
      this.phone = jsondata.phone;
      this.mobile = jsondata.mobile;
      this.linename = jsondata.linename;
      this.lineimage = jsondata.lineimage;
      this.routeid = jsondata.routeid;
      this.routename = jsondata.routename;
      this.issend = jsondata.issend;
      this.isendname = jsondata.isendname;
      this.ot = jsondata.ot;
      this.otname = jsondata.otname;
      this.shifid = jsondata.shifid;
      this.shift = jsondata.shift;
      this.distance = jsondata.distance;
      this.period = jsondata.period;
      this.wakeupwarn = jsondata.wakeupwarn;
      this.wakeup = jsondata.wakeup;
      this.plandate = new Date(jsondata.plandate);
      this.starttime = new Date(jsondata.starttime);
      this.finishtime = new Date(jsondata.finishtime);
      this.wakeupworntime = new Date(jsondata.wakeupworntime);
      this.wakeuptime = new Date(jsondata.wakeuptime);
      this.startwarntime= new Date(jsondata.startwarntime);
      this.laststatuswarn=new Date(jsondata.wakeupworntime);
      this.modifieddate=new Date(jsondata.modifieddate);
    }
    var actwakeup = new  PlanactivityModel(5,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actwakeup);
    var actalc = new  PlanactivityModel(10,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actalc);
    var actpoweron = new  PlanactivityModel(20,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actpoweron);
    var actstart = new  PlanactivityModel(25,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actstart);
    var actfinsh = new  PlanactivityModel(30,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actfinsh);    
  }
}
export class PlanactivityModel {
  vid: number = 0;
  cid: number = 0;
  driverid: number = 0;
  docode: string = "";
  lineimage: string = "";
  statusid: number = 0;
  statusname: string = "";
  statuswarn: Date = new Date("2000-01-01 00:00:00");
  statustaget: Date = new Date("2000-01-01 00:00:00");
  statustime: Date = new Date("2000-01-01 00:00:00");
  statuslevel: number = 0;
  lat: number = 0.0;
  lng: number = 0.0;
  icon: string = "";
  transtatus: number = 0;
  constructor();
  constructor(statusid: number,vid: number,cid: number,driverid:number,docode: string, lineimage: string);
  constructor(statusid?: number, vid?: number,cid?: number,driverid?: number,docode?: string, lineimage?: string) {
    if(vid){this.vid = vid;}
    if(cid){this.cid = cid;}
    if(driverid){this.driverid = driverid;}
    if(lineimage){this.lineimage = lineimage;}
    if(docode){this.docode = docode;}
    if(statusid){
      this.statusid = statusid;
      this.statusname = va.getstatusname(statusid);
      this.icon = va.getactiveicon(statusid);;
    }
   }
  setdata(jsondata: any) {
    this.cid = jsondata.cid;
    this.driverid = jsondata.driverid;
    this.docode = jsondata.docode;
    this.statusid = jsondata.dstatus;
    this.transtatus = jsondata.transtatus;
    this.statusname = jsondata.dstatusname;
    this.statuswarn = new Date(jsondata.dstatuswarn); 
    this.statustaget = new Date(jsondata.dstatustaget); 
    this.statustime = new Date(jsondata.dstatustime);
    this.statuslevel = jsondata.dstatuslevel;
    this.lat = jsondata.dlat;
    this.lng = jsondata.dlng;
    this.icon = jsondata.icon;
    this.lineimage = jsondata.lineimage;    
  }
}
//#endregion

//#region for Master Data
export class DriverdataModel {
  id:number=0;
  drivercode: string = "";
  fullname: string = "";
  linename: string = "";
  prefix: string = "";
  empname: string = "";
  surname: string = "";
  licent: string = "";
  phone: string = "";
  vname: string = "";
  vlicent: string = "";
  vid: number = 0;
  driverimg: string = "";
  transtatus:number =0;
  remark: string = "";
  constructor();
  constructor(jsondata:any);
  constructor(jsondata?:any) {
    if(jsondata){
      this.id = jsondata.id;
      this.drivercode = jsondata.drivercode;
      this.fullname = jsondata.fullname;
      this.linename= jsondata.linename;
      this.prefix = jsondata.prefix;
      this.empname = jsondata.empname;
      this.surname = jsondata.surname;
      this.licent = jsondata.licent;
      this.phone = jsondata.phone;
      this.vname = jsondata.vname;
      this.vlicent = jsondata.vlicent;
      this.vid = jsondata.vid;
      this.driverimg = jsondata.driverimg;  
      this.transtatus= jsondata.transtatus;
      this.remark= jsondata.remark;
    }
   }
}
export class EmployeeModel {
  id: number = 0;
  empcode: string = "";
  empname: string = "";
  prefix: string = "";
  firstname: string = "";
  surename: string = "";
  phone: string = "";
  lineimg: string = "";
  companyname: string = "";
  rolename: string = "";
  remark: string = "";
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any){
    if(jsondata){
      this.id = jsondata.id;
      this.empcode = jsondata.empcode;
      this.empname = jsondata.empname;
      this.prefix = jsondata.prefix;
      this.firstname = jsondata.firstname;
      this.surename = jsondata.surename;
      this.phone = jsondata.phone;
      this.lineimg = jsondata.lineimage;
      this.companyname = jsondata.companyname;
      this.rolename = jsondata.rolename;
      this.remark = jsondata.remark;
    }
   }
}
export class CompanyModel {
  id: number = 0;
  companyname: string = "";
  complogo: string = "";
  phone: string = "";
  contract: string = "";
  contractphone: string = "";
  lat:number=0;
  lng:number=0;
  totalroute: number = 0;
  totalvehicle: number = 0;
  totalemp: number = 0;
  totaldrop: number = 0;
  compid:number=0;
  polygon: string = "";
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any) { 
    if(jsondata){
      this.id = jsondata.id;
      this.companyname = jsondata.companyname;
      this.complogo = jsondata.complogo;
      this.phone = jsondata.phone;
      this.contract = jsondata.contract;
      this.totalroute = jsondata.totalroute?jsondata.totalroute:0;
      this.totalvehicle = jsondata.totalvehicle?jsondata.totalvehicle:0;
      this.totalemp = jsondata.totalemp?jsondata.totalemp:0;
      this.totaldrop = jsondata.totaldrop?jsondata.totaldrop:0;
      this.contractphone= jsondata.contractphone?jsondata.contractphone:"";
      this.lat= jsondata.lat?jsondata.lat:0;
      this.lng= jsondata.lng?jsondata.lng:0;
      this.compid = jsondata.compid?jsondata.compid:0;
    }
  }
}
export class RouteModel {
  id: number = 0;
  routecode: string = "";
  ownerid: number = 0;
  routename: string = "";
  routetype:  number = 0; //0=รับมาทำงาน 1 =ส่งกลับบ้าน
  routetypename: string = "รับพนักงาน";
  distance:number = 0;
  endtime:Date = new Date("2000-01-01 08:00:00"); // เวลาที่ควรถึงปลายทาง
  period: number = 120;
  starttime:Date = new Date("2000-01-01 06:00:00"); // เวลาที่ควรเข้าเส้นทางกี่นาที (เปิดแจ้งพร้อม)
  wakeupwarn:number = 60; // เริ่มเตือนแจ้งเริ่มงานก่อนเวลาเข้าเส้นทางกี่นาที (เปิดแจ้งพร้อม,0=ไม่เตือน)
  wakeupwarntime:Date = new Date("2000-01-01 05:00:00");  
  wakeup:number = 30; // เริ่มเตือนสุดท้ายเมื่อยังไม่แจ้งเริ่มงานก่อนเวลาเข้าเส้นทางกี่นาที (เตือนแจ้งพร้อม,0=ไม่เตือน)
  wakeuptime:Date = new Date("2000-01-01 05:30:00");  
  startwarn:number = 20; // เวลาที่ควรสาร์ทเครื่องยนต์เพิ่มเริ่มเดินทางกี่นาที (0=ไม่เตือน)
  startwarntime:Date = new Date("2000-01-01 05:40:00");  
  dpinroute: DPinroutedata[] = [];
  vinroute: VehicleRoutedata[] = [];
  empinroute: EmployeeModel[]=[];
  transtatus: number = 1;
  polygon:string = "";
  constructor();
  constructor(data:RouteModel);
  constructor(data?:RouteModel) { 
    if(data){
      this.id = data.id;
      this.routecode = data.routecode;
      this.ownerid = data.ownerid;
      this.routename = data.routename;
      this.routetype = data.routetype;
      this.routetypename = data.routetypename;
      this.distance = data.distance;
      this.endtime = data.endtime;
      this.period = data.period;
      this.starttime = data.starttime;
      this.wakeupwarn = data.wakeupwarn;
      this.wakeupwarntime = data.wakeupwarntime;
      this.wakeup = data.wakeup;
      this.wakeuptime = data.wakeuptime;
      this.startwarn = data.startwarn;
      this.startwarntime = data.startwarntime;
      this.dpinroute = data.dpinroute;
      this.vinroute = data.vinroute;
      this.empinroute = data.empinroute;
      this.transtatus = data.transtatus;
    }
  }
  setdata(jsondata: any) {
    if(jsondata){
      this.id = jsondata.id;
      this.routecode = jsondata.routecode;
      this.ownerid = jsondata.ownerid;
      this.routename = jsondata.routename;
      this.routetype = jsondata.routetype;
      this.period = jsondata.period;
      this.transtatus = jsondata.transtatus;
      this.routetypename = jsondata.routetypename;
      this.distance = jsondata.distance;
      this.wakeupwarn = jsondata.wakeupwarn;
      this.wakeup = jsondata.wakeup;
      this.startwarn = jsondata.startwarn;
      this.starttime = new Date(jsondata.starttime);
      this.wakeupwarntime=new Date(this.starttime) ;
      this.wakeuptime=new Date(this.starttime) ;
      this.startwarntime=new Date(this.starttime) ;
      this.endtime=new Date(this.starttime) ;
      this.wakeupwarntime.setMinutes(this.wakeupwarntime.getMinutes() - this.wakeupwarn);
      this.wakeuptime.setMinutes(this.wakeuptime.getMinutes() - this.wakeup);
      this.startwarntime.setMinutes(this.startwarntime.getMinutes() - this.startwarn);
      this.endtime.setMinutes(this.endtime.getMinutes() + this.period);
    }
  }
}
export class RouteplanModel {
  plankey:string="";
  plancode:string="";
  plantype: number = 0; // 0 = masterplan save in route, 2 = weekplan save in routeday, 3 normal plan save in plan  
  routeid: number = 0;
  vid:number=0; // รถใช้สำหรับ plantype 2,3
  vname:string ="";
  vlicent:string ="";
  gpsvid:string ="";
  driverid:number=0; // รถใช้สำหรับ plantype 2,3
  drivername:string ="";
  driverimage:string ="";
  driverphone:string ="";
  routeday:number=0; // รถใช้สำหรับ plantype 1,2
  plandate:Date= new Date(2000,1,1,0,0,0,0); // รถใช้สำหรับ plantype 1,2,3 ()
  routecode: string = "";
  ownerid: number = 0;
  routename: string = "";
  routetype:  number = 0; //0=รับมาทำงาน 1 =ส่งกลับบ้าน
  routetypename: string = "รับพนักงาน";
  distance:number = 0;
  period: number = 120;
  starttime:Date = new Date("2000-01-01 00:00:00"); // เวลาที่ควรเข้าเส้นทางกี่นาที (เปิดแจ้งพร้อม)
  wakeupwarn:number = 60; // เริ่มเตือนแจ้งเริ่มงานก่อนเวลาเข้าเส้นทางกี่นาที (เปิดแจ้งพร้อม,0=ไม่เตือน)
  wakeupwarntime:Date = new Date("2000-01-01 00:00:00");  
  wakeup:number = 30; // เริ่มเตือนสุดท้ายเมื่อยังไม่แจ้งเริ่มงานก่อนเวลาเข้าเส้นทางกี่นาที (เตือนแจ้งพร้อม,0=ไม่เตือน)
  wakeuptime:Date = new Date("2000-01-01 00:00:00");  
  startwarn:number = 20; // เวลาที่ควรสาร์ทเครื่องยนต์เพิ่มเริ่มเดินทางกี่นาที (0=ไม่เตือน)
  startwarntime:Date = new Date("2000-01-01 00:00:00");  
  endtime:Date = new Date("2000-01-01 00:00:00"); // เวลาที่ควรถึงปลายทาง
  shiftid :number = 0;
  shiftname :string = "กะเช้า";
  ot : number = 0;
  otname :string = "ปกติ";
  issend : number = 0;
  issendname :string = "รับพนักงาน";
  transtatus: number = 1;
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any) {
    if(jsondata){
      this.vid = jsondata.vid;
      this.vname = jsondata.vname;
      this.vlicent = jsondata.vlicent;
      this.routeid = jsondata.routeid;
      this.routeday = jsondata.routeday;
      this.routecode = jsondata.routecode;
      this.plantype = jsondata.plantype;
      this.plancode = jsondata.plancode;
      this.ownerid = jsondata.ownerid;
      this.routename = jsondata.routename;
      this.routetype = jsondata.routetype;
      this.period = jsondata.period;
      this.transtatus = jsondata.transtatus;
      this.routetypename = jsondata.routetypename;
      this.distance = jsondata.distance;
      this.wakeupwarn = jsondata.wakeupwarn;
      this.wakeup = jsondata.wakeup;
      this.startwarn = jsondata.startwarn;
      this.shiftid = jsondata.shiftid?jsondata.shiftid:0;
      this.shiftname = jsondata.shiftname?jsondata.shiftname:"กะเช้า";
      this.ot = jsondata.ot?jsondata.ot:0;
      this.otname = jsondata.otname?jsondata.otname:"ปกติ";
      this.issend = jsondata.issend?jsondata.issend:0;
      this.issendname = jsondata.issendname?jsondata.issendname:"รับพนักงาน";
      this.driverid = jsondata.driverid?jsondata.driverid:0;
      this.drivername = jsondata.drivername?jsondata.drivername:"";
      this.driverphone = jsondata.driverphone?jsondata.driverphone:"";
      this.driverimage = jsondata.driverimage?jsondata.driverimage:"";
      this.gpsvid = jsondata.gpsvid?jsondata.gpsvid:"";      
      this.plandate = new Date(jsondata.plandate);   
      this.starttime = new Date(this.plandate);
      var st = new Date(jsondata.starttime)
      this.starttime.setHours(st.getHours(),st.getMinutes(),0,0);
      this.wakeupwarntime = new Date(this.starttime)
      this.wakeuptime=  new Date(this.starttime);
      this.startwarntime=  new Date(this.starttime);
      this.endtime=  new Date(this.starttime);
  
      this.wakeupwarntime.setMinutes(this.wakeupwarntime.getMinutes() - this.wakeupwarn);
      this.wakeuptime.setMinutes(this.wakeuptime.getMinutes() - this.wakeup);
      this.startwarntime.setMinutes(this.startwarntime.getMinutes() - this.startwarn);
      this.endtime.setMinutes(this.endtime.getMinutes() + this.period);
      this.plankey = va.DateToString(this.starttime,"yyyyMMdd");
    }
  }
  setdatabyroute(data: RouteModel) {
    this.routeid = data.id;
    this.routecode = data.routecode;
    this.ownerid = data.ownerid;
    this.routename = data.routename;
    this.routetype = data.routetype;
    this.period = data.period;
    this.transtatus = data.transtatus;
    this.routetypename = data.routetypename;
    this.distance = data.distance;
    this.wakeupwarn = data.wakeupwarn;
    this.wakeup = data.wakeup;
    this.startwarn = data.startwarn;
    this.starttime = new Date(this.plandate);
    var st = new Date(data.starttime)
    this.starttime.setHours(st.getHours(),st.getMinutes(),0,0);
    this.wakeupwarntime = new Date(this.starttime)
    this.wakeuptime=  new Date(this.starttime);
    this.startwarntime=  new Date(this.starttime);
    this.endtime=  new Date(this.starttime);

    this.wakeupwarntime.setMinutes(this.wakeupwarntime.getMinutes() - this.wakeupwarn);
    this.wakeuptime.setMinutes(this.wakeuptime.getMinutes() - this.wakeup);
    this.startwarntime.setMinutes(this.startwarntime.getMinutes() - this.startwarn);
    this.endtime.setMinutes(this.endtime.getMinutes() + this.period);

  }


}
export class CalendardayplanModel{
  plankey: string= "20000101";
  plandate: Date = new Date("2000-01-01 00:00:00");
  today:Date =new Date();
  colorday : string = "";
  listtime : Calendardata[] = [];
  public activeroute: RoutedayplanModel[] =[];
  public listrouteplan: RoutedayplanModel[] =[];
  public listplan: RouteplanModel[] =[];
  noplan=true;

  constructor(period:number){ 
    var totaldata = Math.floor(1440/period);
    this.today.setHours(0, 0, 0, 0);
    for(var i =0; i< totaldata;i++){
      var temp = new Calendardata(i,this.plandate,period);
      this.listtime.push(temp);
      this.plandate.setMinutes(this.plandate.getMinutes()+period) ;
    }

  }
  public setactivedate(activedate:Date){
    this.plankey = va.DateToString(activedate,'yyyyMMdd');  
    this.plandate  = new Date(activedate.getFullYear(),activedate.getMonth(),activedate.getDate(),0,0,0,0);
    this.colorday = va.getdaycolor(activedate);
  }
}
export class RoutedayplanModel{
  public plankey: string= "20000101";
  public plandate: Date = new Date("2000-01-01 00:00:00");
  route: RouteModel =new RouteModel();
  listplan : RouteplanModel[] = [];
  listvplan : VehicleplanModel[] = [];
  constructor(activedate:Date,route: RouteModel ){
    this.route =route;
    this.plankey = va.DateToString(activedate,'yyyyMMdd');  
    this.plandate  = new Date(activedate.getFullYear(),activedate.getMonth(),activedate.getDate(),0,0,0,0);
  }
  setactivdayplan(activedate:Date){
    this.plankey = va.DateToString(activedate,'yyyyMMdd');  
    this.plandate  = new Date(activedate.getFullYear(),activedate.getMonth(),activedate.getDate(),0,0,0,0);
    this.listplan  = [];
    this.listvplan  = [];
  }
}
export class CalendarplanModel {
  id : number = 0;
  cdate : Date = new Date;
  iddate : string = "";  
  textdate : string = "วันอาทิตย์";
  listdata : Calendardata[] = [];
  listplan : RouteplanModel[] = [];
  listvplan : VehicleplanModel[] = [];
  colorday : string = "";
  isselect: boolean= false;
  ismaseter: boolean= false;

  constructor(period : number,id : number, cdate: Date) {
    this.id = id;
    this.cdate = new Date(cdate);
    this.cdate.setHours(0, 0, 0, 0);
    this.textdate = va.getdayname(cdate);;
    var totaldata = Math.floor(1440/period);
    var tdate=new Date(this.cdate);
    this.colorday = va.getdaycolor(cdate);
    // console.log("start tdate ",tdate);
    for(var i =0; i< totaldata;i++){
      // console.log(i+ "tdate ",tdate);
      var temp = new Calendardata(i,tdate,period);
      this.listdata.push(temp);
      tdate.setMinutes(tdate.getMinutes()+period) ;
    }
  }
  
}
export class VehicleplanModel {
  vid : number = 0;
  vname : string ="";
  vlicent : string ="";
  gpsvid : string ="";
  driverid: number = 0;
  drivername: string = "";
  driverimage: string = "";
  driverphone: string = "";
  plandate: Date = new Date;
  listdata : Calendardata[] = [];
  isselect: boolean= false;
  ismaseter: boolean= false;
  routeday: number=0;
  constructor();
  constructor(jsondata:any,period:number);
  constructor(jsondata:any,period:number,cdate:Date);
  constructor(jsondata?:any,period?:number,cdate?:Date) { 
    if(jsondata){
      this.vid = jsondata.vid;
      this.vname = jsondata.vname;
      this.vlicent = jsondata.vlicent;
      this.driverid= jsondata.driverid;
      this.drivername= jsondata.drivername;
      this.driverimage= jsondata.driverimage;
      this.driverphone= jsondata.driverphone; 
      this.gpsvid= jsondata.gpsvid?jsondata.gpsvid:""; 
      this.plandate= new Date(jsondata.plandate)
      if(cdate){this.plandate= new Date(jsondata.plandate)}
      this.gpsvid= jsondata.gpsvid?jsondata.gpsvid:""; 
    }
    if(period){  this.setperiod(period,this.plandate)  }
  }
  setperiod(period:number,cdate:Date){
    var totaldata = Math.floor(1440/period);
    var tdate=new Date(cdate);
    for(var i =0; i< totaldata;i++){
      // console.log(i+ "tdate ",tdate);
      var temp = new Calendardata(i,tdate,period);
      this.listdata.push(temp);
      tdate.setMinutes(tdate.getMinutes()+period) ;
    }
  }

}
export class VehicleModel {
  vid: number = 0;
  vname: string = "";
  vlicent: string = "";
  gpsvid: string = "";
  qrcode: string = "";
  fullname: string = "";
  driverimage: string = "";
  driverid: number = 0;
  drivername: string = "";
  driversurname: string = "";
  driverphone: string = "";
  dlicense: string = "";
  remark: string = "";
  serialbox:string = "";
  transtatus: number = 0;
  provinceid: number = 81;
  province:string = "กรุงเทพมหานคร";
  provincecode:string = "กท";
  vtype: number = 1;
  typename: string = "รถตู้";
  licent1: string = "";
  licent2: string = "";
  
  listroute: VehicleRoutedata[] = [];
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any) { 
    if(jsondata){
      this.vid = jsondata.vid;
      this.vname = jsondata.vname;
      this.vlicent = jsondata.vlicent;
      this.qrcode = jsondata.qrcode;
      this.dlicense = jsondata.dlicense;
      this.remark = jsondata.remark;
      this.driverid= jsondata.driverid;
      this.fullname = jsondata.fullname;
      this.driverimage= jsondata.driverimage;
      this.serialbox= jsondata.serialbox?jsondata.serialbox:"";
      this.transtatus= jsondata.transtatus?jsondata.transtatus:"";
      this.serialbox= jsondata.serialbox?jsondata.serialbox:"";
      this.transtatus= jsondata.transtatus?jsondata.transtatus:"";
      this.vtype= jsondata.vtype?jsondata.vtype:1;
      this.typename = jsondata.typename?jsondata.typename:"รถตู้";
      this.provinceid= jsondata.provinceid?jsondata.provinceid:81;
      this.province = jsondata.province?jsondata.province:"กรุงเทพมหานคร";
      this.provincecode = jsondata.provincecode?jsondata.provincecode:"กท";
      this.drivername = jsondata.drivername?jsondata.drivername:"";
      this.driversurname = jsondata.driversurname?jsondata.driversurname:"";
      this.driverphone = jsondata.driverphone?jsondata.driverphone:"";
      this.gpsvid= jsondata.gpsvid?jsondata.gpsvid:""; 

      if(this.vlicent && this.vlicent.length>0){
        var licent = this.vlicent.split('-');
        if(licent.length>1){this.licent1=licent[0];this.licent2=licent[1];}
      }
    }
  }
}
export class ComshiftModel {
  id : number =0;
  compid:number =0;
  shift : string ="";
  sendtime : Date =new Date("2000-01-01 00:00:00");
  receivetime : Date =new Date("2000-01-01 00:00:00");
  ottime : Date =new Date("2000-01-01 00:00:00");
  transtatus :number =1;

  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any){
    if(jsondata){
      this.id = jsondata.id;
      this.shift = jsondata.shift;
      this.sendtime = new Date(jsondata.sendtime);
      this.receivetime = new Date(jsondata.receivetime);
      this.ottime = new Date(jsondata.ottime);
      this.compid =jsondata.compid;
    }
  }
  setdata() {
   
  };
}
export class GpslogModel {
   gpstime:Date = new Date;
   gpsstatus:number = 0;
   lat:number = 0;
   lng:number = 0;
   speed:number = 0;
   show:boolean=false;
   statuscolor:string = "#d6d4d4";
   ref:number = 0;
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any){
    if(jsondata){
      this.gpstime = new Date(jsondata.gpstime);
      this.gpsstatus = jsondata.gpsstatus;
      this.lat = jsondata.lat;
      this.lng = jsondata.lng;
      this.speed = jsondata.speed;
      // this.show = (jsondata.gpsstatus==31||jsondata.gpsstatus==33);
      this.statuscolor = va.getvcolor(this.gpsstatus);
    }
  }
}

//#endregion




export class Dashboarddata {
  cid: number = 0;
  companyname: string = "";
  docode: string = "";
  plankey: string = "";
  plandate:Date = new Date();
  vid: number = 0;
  vname: string = "";
  vlicent: string = "";
  serialbox: string = "";
  driverid: number = 0;
  fullname: string = "";
  phone: string = "";
  mobile: string = "";
  linename: string = "";
  lineimage: string = "";
  routeid: number = 0;
  routename: string = "";
  issend: number = 0;
  isendname: string = "";
  ot: number = 0;
  otname: string = "";
  shifid: number = 0;
  shift: string = "";
  distance: number = 0;
  starttime:Date = new Date("2000-01-01 00:00:00");
  startact:Date = new Date("2000-01-01 00:00:00");
  period: number = 0;
  finishtime:Date = new Date("2000-01-01 00:00:00");
  finishact:Date = new Date("2000-01-01 00:00:00");
  wakeupwarn: number = 0;
  wakeupworntime:Date = new Date("2000-01-01 00:00:00");
  wakeup: number = 0;
  wakeuptime:Date = new Date("2000-01-01 00:00:00");
  wakeupact:Date = new Date("2000-01-01 00:00:00");
  startwarn: number = 0;
  startwarntime:Date = new Date("2000-01-01 00:00:00");
  startwarnact:Date = new Date("2000-01-01 00:00:00");
  alcstatus: number = 0;
  alcvalue: number = 0;
  acltime:Date = new Date("2000-01-01 00:00:00");
  listactivity:DoActivity[] =[];


  
  dstatus: number = 0;
  dstatusname: string = "";
  dstatuswarn: Date = new Date("2000-01-01 00:00:00");
  dstatustaget: Date = new Date("2000-01-01 00:00:00");
  dstatustime: Date = new Date("2000-01-01 00:00:00");
  dstatuslevel: number = 0;
  dlat: number = 0.0;
  dlng: number = 0.0;
  icon: string = "";
  actvalue: number = 0;
  constructor();
  constructor(jsondata: any);
  constructor(jsondata?: any) { 
    this.cid = jsondata.cid;
    this.companyname = jsondata.companyname;
    this.docode = jsondata.docode;
    this.plankey = jsondata.plankey;
    this.vid = jsondata.vid;
    this.vname = jsondata.vname;
    this.vlicent = jsondata.vlicent;
    this.serialbox = jsondata.serialbox;
    this.driverid = jsondata.driverid;
    this.fullname = jsondata.fullname;
    this.phone = jsondata.phone;
    this.mobile = jsondata.mobile;
    this.linename = jsondata.linename;
    this.lineimage = jsondata.lineimage;
    this.routeid = jsondata.routeid;
    this.routename = jsondata.routename;
    this.issend = jsondata.issend;
    this.isendname = jsondata.isendname;
    this.ot = jsondata.ot;
    this.otname = jsondata.otname;
    this.shifid = jsondata.shifid;
    this.shift = jsondata.shift;
    this.distance = jsondata.distance;
    this.period = jsondata.period;
    this.wakeupwarn = jsondata.wakeupwarn;
    this.wakeup = jsondata.wakeup;
    this.plandate = new Date(jsondata.plandate);
    this.starttime = new Date(jsondata.starttime);
    this.finishtime = new Date(jsondata.finishtime);
    this.wakeupworntime = new Date(jsondata.wakeupworntime);
    this.wakeuptime = new Date(jsondata.wakeuptime);
    this.startwarntime= new Date(jsondata.startwarntime);
    var actwakeup = new  DoActivity(5,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actwakeup);
    var actalc = new  DoActivity(10,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actalc);
    var actpoweron = new  DoActivity(20,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actpoweron);
    var actstart = new  DoActivity(25,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actstart);
    var actfinsh = new  DoActivity(30,this.vid,this.cid,this.driverid,this.docode,this.lineimage);
    this.listactivity.push(actfinsh);
  }
}

export class DoCompany {
  cid: number = 0;
  company: string = "";
  comadmin: number = 0;
  complogo: string = "";
  totaldo: number = 0;
  totalwake: number = 0;
  totaltemp: number = 0;
  totalalc: number = 0;
  totalstart: number = 0;
  totalotw: number = 0;
  totalfinish: number = 0;
  dolist: DoData[] = [];
  unwakelist: DoData[] = [];
  wakelist: DoData[] = [];
  alclist: DoData[] = [];
  templist: DoData[] = [];
  startlist: DoData[] = [];
  otwlist: DoData[] = [];
  finishlist: DoData[] = [];
  showdetail: boolean = true;
  showgroup: boolean[] = [true, true, true, true, true];
  constructor() { }
  setdata(jsondata: any) {
    this.cid = jsondata.cid;
    this.company = jsondata.companyname;
    this.comadmin = jsondata.comadmin;
    this.complogo = jsondata.complogo;
  }
}
export class DoData {
  cid: number = 0;
  companyname: string = "";
  complogo: string = "";
  driverid: number = 0;
  fullname: string = "";
  phone: string = "";
  mobile: string = "";
  linename: string = "";
  lineimage: string = "";
  docode: string = "";
  workday: string = "";
  doname: string = "";
  routename: string = "";
  issend: number = 0;
  isendname: string = "";
  ot: number = 0;
  otname: string = "";
  shifid: number = 0;
  shift: string = "";
  vid: number = 0;
  serialbox: string = "";
  vname: string = "";
  vlicent: string = "";
  vlat: number = 0.0;
  vlng: number = 0.0;
  vstatus: number = 0.0;
  vstatuscorlor: string = "#d6d4d4"
  vstatusname: string = "";
  vlocation: string = "";
  vlocationcode: string = "";
  vspeed: number = 0;
  vheader: number = 0;
  vio: string = "";
  starttext: string = "";
  starttime: string = "2000-01-01 00:00:00";
  finishtext: string = "";
  finishtime: string = "2000-01-01 00:00:00";
  listdp: string = "";
  listperiod: string = "";
  listdpemp: string = "";
  listemp: string = "";
  liststatus: string = "";
  totalemp: number = 0;
  wakeup: number = 0;
  alc: number = 0;
  temp: number = 0;
  start: number = 0;
  otw: number = 0;
  finish: number = 0;
  wakeupshowtime: string = "";
  alcshowtime: string = ""
  tempshowtime: string = ""
  startshowtime: string = ""
  otwshowtime: string = ""
  finishshowtime: string = ""
  statuscorlor: string = "#fdfefe"
  
  laststatus: number = 0;
  nextwarn: string = "";
  nextwarntime: string = "2000-01-01 00:00:00";
  nexttaget: string = "";
  nextstatus: number = 5;
  nextstatusname: string = "";
  nexttagettime: string = "2000-01-01 00:00:00";
  nextlat: number = 0;
  nextlng: number = 0;
  nexticon: string = "";
  listactivity: DoActivity[] = [];

  setdata(jsondata: any) {
    this.cid = jsondata.cid;
    this.companyname = jsondata.companyname;
    this.driverid = jsondata.driverid;
    this.fullname = jsondata.fullname;
    this.linename = jsondata.linename;
    this.lineimage = jsondata.lineimage;
    this.phone = jsondata.phone;
    this.mobile = jsondata.mobile;
    this.vid = jsondata.vid;
    this.vname = jsondata.vname;
    this.vlicent = jsondata.vlicent;
    this.docode = jsondata.docode;
    this.workday = jsondata.workday;
    this.doname = jsondata.doname;
    this.routename = jsondata.routename;
    this.issend = jsondata.issend;
    this.isendname = jsondata.isendname;
    this.ot = jsondata.ot;
    this.otname = jsondata.otname;
    this.shifid = jsondata.shifid;
    this.shift = jsondata.shift;
    this.starttime = jsondata.starttime;
    this.finishtext = jsondata.finishtext;
    this.finishtime = jsondata.finishtime;
    this.listdp = jsondata.listdp;
    this.listperiod = jsondata.listperiod;
    this.listdpemp = jsondata.listdpemp;
    this.listemp = jsondata.listemp;
    this.liststatus = jsondata.liststatus;
    this.totalemp = jsondata.totalemp;
    this.serialbox = jsondata.serialbox;
  }
}
export class DoActivity {
  vid: number = 0;
  cid: number = 0;
  driverid: number = 0;
  docode: string = "";
  lineimage: string = "";
  statusid: number = 0;
  statusname: string = "";
  statuswarn: string = "2000-01-01 00:00:00";
  statustaget: string = "2000-01-01 00:00:00";
  statustime: Date = new Date("2000-01-01 00:00:00");
  showtime: string = "";
  statuslevel: number = 0;
  lat: number = 0.0;
  lng: number = 0.0;
  icon: string = "";
  transtatus: number = 0;
  constructor();
  constructor(statusid: number,vid: number,cid: number,driverid:number,docode: string, lineimage: string);
  constructor(statusid?: number, vid?: number,cid?: number,driverid?: number,docode?: string, lineimage?: string) {
    if(vid){this.vid = vid;}
    if(cid){this.cid = cid;}
    if(driverid){this.driverid = driverid;}
    if(lineimage){this.lineimage = lineimage;}
    if(docode){this.docode = docode;}
    if(statusid){
      this.statusid = statusid;
      this.statusname = va.getstatusname(statusid);
      this.icon = va.getactiveicon(statusid);;
    }
   }
  setdata(jsondata: any) {
    this.cid = jsondata.cid;
    this.driverid = jsondata.driverid;
    this.docode = jsondata.docode;
    this.statusid = jsondata.dstatus;
    this.transtatus = jsondata.actvalue;
    this.statusname = jsondata.dstatusname;
    this.statuswarn = jsondata.dstatuswarn;
    this.statustaget = jsondata.dstatustaget;
    this.statustime = new Date(jsondata.dstatustime);
    this.statuslevel = jsondata.dstatuslevel;
    this.lat = jsondata.dlat;
    this.lng = jsondata.dlng;
    this.icon = jsondata.icon;
    this.lineimage = jsondata.lineimage;
  }
}
export class VehicleDashboard {
  constructor() { }
  vid:number=0;
  admincode: string = "";
  adminname: string = "";
  gpsstatus: number = 0;
  gpstime: string = "2000-01-01 00:00:00";
  header: number = 0;
  io: string = "";
  lat: number = 0.0;
  lng: number = 0.0;
  serialbox: string = "";
  speed: number = 0;
  statusname: string = "";
  driverlicence:string="";
  driverid :number = 0;
  drivername:string="";

  setdata(jsondata: any) {
    this.admincode = jsondata.admincode;
    this.adminname = jsondata.adminname;
    this.gpsstatus = jsondata.gpsstatus;
    this.gpstime = jsondata.gpstime;
    this.header = jsondata.header;
    this.io = jsondata.io;
    this.lat = jsondata.lat;
    this.lng = jsondata.lng;
    this.serialbox = jsondata.serialbox;
    this.speed = jsondata.speed;
    this.statusname = jsondata.statusname;
    if(jsondata.vid){this.vid = jsondata.vid;}
    if(jsondata.driverlicence){this.driverlicence = jsondata.driverlicence;}
    if(jsondata.drivername){this.driverlicence = jsondata.drivername;}
    if(jsondata.driverid){this.driverlicence = jsondata.driverid;}
  }

}

// ============= Company ==================

export class Droppointdata {
  constructor() { }
  id: number = 0;
  routecode: string = "";
  pointname: string = "";
  location: string = "";
  pointtype: number = 0;
  lat: number = 0.0;
  lng: number = 0.0;
  ownerid: number = 0;
  routeid: number = 0;
  routename: string = "";
  remark: string = "";
  transtatus: number = 0;
  setdata(jsondata: any) {
    this.id = jsondata.id;
    this.routecode = jsondata.routecode;
    this.pointname = jsondata.pointname;
    this.location = jsondata.location;
    this.pointtype = jsondata.pointtype;
    this.lat = jsondata.lat;
    this.lng = jsondata.lng;
    this.ownerid = jsondata.ownerid;
    this.routeid = jsondata.routeid;
    this.routename = jsondata.routename;
    this.remark = jsondata.remark;
    this.transtatus = jsondata.transtatus;
  }
}

export class VehicleRoutedata {
  constructor() { }
  vid: number = 0;
  vname: string = "";
  vlicent: string = "";
  gpsvid: string = "";
  driverid: number = 0;
  drivername: string = "";
  routeid: number = 0;
  routename: string = "";
  routecode: string = "";
  period: number = 0;
  distance: number = 0;
  starttime: string = "";
  endtime: string = "";
  wakeuptime: string = "";
  wakeupwarn: string = "";
  otwtime: string = "";
  shiftname: string = "";
  otname: string = "";
  issendname: string = "";
  setdata(jsondata: any) {
    this.vid = jsondata.vid;
    this.vname = jsondata.vname;
    this.vlicent = jsondata.vlicent;
    this.driverid = jsondata.driverid;
    this.drivername = jsondata.drivername;
    this.routeid = jsondata.routeid;    
    this.routename = jsondata.routename;
    this.routecode = jsondata.routecode;
    this.starttime = jsondata.starttime;
    this.endtime = jsondata.endtime;
    this.wakeuptime = jsondata.wakeuptime;
    this.wakeupwarn = jsondata.wakeupwarn;
    this.otwtime = jsondata.otwtime;
    this.shiftname = jsondata.shiftname;
    this.otname = jsondata.otname;
    this.issendname = jsondata.issendname;
    this.period = jsondata.period;
    this.distance = jsondata.distance;
    this.gpsvid = jsondata.gpsvid;
  }
}

export class DPinroutedata {
  constructor() { }
  routeid: number = 0;
  item: string = "";
  dpid: number = 0;
  pointname: string = "";
  pointtime: Date = new Date('2000-01-01 00:00:00');
  lat: number = 0;
  lng: number = 0;
  period: number = 0;
  totalperiod: number = 0;
  distance: number = 0;
  totaldistance: number = 0;
  transtatus: number = 0;
  setdata(jsondata: any) {
    this.routeid = jsondata.routeid;
    this.item = jsondata.item;
    this.dpid = jsondata.dpid;
    this.pointname = jsondata.pointname;
    this.lat = jsondata.lat;
    this.lng = jsondata.lng;
    this.period = jsondata.period;
    this.totalperiod = jsondata.totalperiod;
    this.distance = jsondata.distance;
    this.totaldistance = jsondata.totaldistance;
    this.transtatus = jsondata.transtatus;
  }
}

export class Calendardata {
  id : number = 0;
  sdate : Date = new Date;
  edate : Date = new Date;
  period : number = 0;
  showdate : string = "01-01-2024";
  starttime : string = "00:00";
  endtime : string = "00:00";
  plancode : string = "";
  routeid : number = 0;

  constructor(id:number,sdate:Date,period:number) { 
    this.id = id;
    this.sdate = new Date(sdate);
    this.edate =  new Date(sdate);
    this.edate.setMinutes(this.edate .getMinutes()+period) ;
    this.showdate = va.DateToString(this.sdate,'dd-MM-yy');
    this.starttime = va.DateToString(this.sdate,'HH:mm'); 
    this.endtime = va.DateToString(this.edate,'HH:mm');
  }
}
export class Calendarslot {
  startid : number = 0;
  endid : number = 0;
  sdate : Date = new Date;
  edate : Date = new Date;
  period : number = 0;
  dayname : string = "";
  showdate : string = "01-01-2024";
  starttime : string = "00:00";
  endtime : string = "00:00";
  plancode : string = "";
  plantype : number = 0;
  constructor() {  }

  setdata(jsondata:any){
    this.plancode = jsondata.plancode;
    this.startid = jsondata.id;
    this.showdate = jsondata.showdate;
    this.sdate = jsondata.sdate;
    this.endid = jsondata.id;
    this.edate = jsondata.edate;
    this.starttime = jsondata.starttime;
    this.endtime = jsondata.endtime;
  }
}





export class data {
  constructor() { }
  setdata(jsondata: any) {

  }
}















