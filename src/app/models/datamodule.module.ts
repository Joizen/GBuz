import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})


export class CompanyDashboard {
  cid : number;
  company : string;
  comadmin : number;
  complogo : string;
  totaldo : number;
  totalwake : number;
  totaltemp : number;
  totalalc : number;
  totalstart : number;
  totalotw : number;
  totalfinish : number;
  driverlist: DriverDashboard[];
  
  constructor( )  {
    this.cid= 0;
    this.company= "";
    this.comadmin= 0;
    this.complogo= "";
    this.totaldo= 0;
    this.totalwake= 0;
    this.totaltemp= 0;
    this.totalalc= 0;
    this.totalstart= 0;
    this.totalotw= 0;
    this.totalfinish= 0;
    this.driverlist = [];
  }

  setdata(jsondata:any){
    this.cid = jsondata.cid;
    this.company = jsondata.companyname;
    this.comadmin = jsondata.comadmin;
    this.complogo = jsondata.complogo;
    // this.totaldo = jsondata.totaldo;
    // this.totalwake = jsondata.totalwake;
    // this.totaltemp = jsondata.totaltemp;
    // this.totalalc = jsondata.totalalc;
    // this.totalstart = jsondata.totalstart;
    // this.totalotw = jsondata.totalotw;
    // this.totalfinish = jsondata.totalfinish;
  }
}

export class DriverDashboard {
  driverid : number;
  fullname : string;
  phone : string;
  mobile : string;
  vid : number;
  vname : string;
  vlicent : string;
  docode : string;
  workday : string;
  doname : string;
  routename : string;
  issend : number;
  isendname : string;
  ot : number;
  otname : string;
  shifid : number;
  shift : string;
  cid : number;
  companyname : string;
  startpoint : string;
  startpointname : string;
  starttext : string;
  starttime : string;
  finishtext : string;
  finishtime : string;
  listdp : string;
  listperiod : string;
  listdpemp : string;
  listemp : string;
  liststatus : string;
  totalemp : number;
  nextwarn : string;
  nextwarntime : string;
  nexttaget : string;
  nextstatus : string;
  nextstatusname : string;
  nexttagettime : string;
  nextlat : number;
  nextlng : number;
  nexticon : string;
  listactivity : DriverActivity[];
  wakestatus : boolean;
  
  constructor( )  {
    this.driverid = 0;
    this.fullname = "";
    this.phone = "";
    this.mobile = "";
    this.vid = 0;
    this.vname = "";
    this.vlicent = "";
    this.docode = "";
    this.workday = "";
    this.doname = "";
    this.routename = "";
    this.issend = 0;
    this.isendname = "";
    this.ot = 0;
    this.otname = "";
    this.shifid = 0;
    this.shift = "";
    this.cid = 0;
    this.companyname = "";
    this.startpoint = "";
    this.startpointname = "";
    this.starttext = "";
    this.starttime = "2000-01-01 00:00:00";
    this.finishtext = "";
    this.finishtime = "2000-01-01 00:00:00";
    this.listdp = "";
    this.listperiod = "";
    this.listdpemp = "";
    this.listemp = "";
    this.liststatus = "";
    this.totalemp = 0;
    this.nextwarn = "";
    this.nextwarntime = "2000-01-01 00:00:00";
    this.nexttaget = "";
    this.nextstatus = "";
    this.nextstatusname = "";
    this.nexttagettime = "2000-01-01 00:00:00";
    this.nextlat = 0;
    this.nextlng = 0;
    this.nexticon = "";
    this.wakestatus = false;
    this.listactivity = [];
  }

  setdata(jsondata:any){
    this.driverid = jsondata.driverid;
    this.fullname = jsondata.fullname;
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
    this.cid = jsondata.cid;
    this.companyname = jsondata.companyname;
    this.startpoint = jsondata.startpoint;
    this.startpointname = jsondata.startpointname;
    this.starttext = jsondata.starttext;
    this.starttime = jsondata.starttime;
    this.finishtext = jsondata.finishtext;
    this.finishtime = jsondata.finishtime;
    this.listdp = jsondata.listdp;
    this.listperiod = jsondata.listperiod;
    this.listdpemp = jsondata.listdpemp;
    this.listemp = jsondata.listemp;
    this.liststatus = jsondata.liststatus;
    this.totalemp = jsondata.totalemp;
    this.nextwarn = jsondata.nextwarn;
    this.nextwarntime = jsondata.nextwarntime;
    this.nexttaget = jsondata.nexttaget;
    this.nextstatus = jsondata.nextstatus;
    this.nextstatusname = jsondata.nextstatusname;
    this.nexttagettime = jsondata.nexttagettime;
    this.nextlat = jsondata.nextlat;
    this.nextlng = jsondata.nextlng;
    this.nexticon = jsondata.nexticon;
  }
}

export class DriverActivity {
  driverid : number;
  statusid : number;
  statusname : string;
  statuswarn : string;
  statustaget : string;
  statustime : string;
  statuslevel : number;
  lat : number;
  lng : number;
  icon : string;
  transtatus : number;

  constructor( )  {
    this.driverid = 0;
    this.statusid = 0;
    this.statusname =  "";
    this.statuswarn =  "2000-01-01 00:00:00";
    this.statustaget =  "2000-01-01 00:00:00";
    this.statustime =  "2000-01-01 00:00:00";
    this.statuslevel = 0;
    this.lat = 0;
    this.lng = 0;
    this.icon =  "";
    this.transtatus = 0;
  }

  setdata(jsondata:any){
    this.driverid = jsondata.driverid;
    this.statusid = jsondata.dstatus;
    this.statusname = jsondata.dstatusname;
    this.statuswarn = jsondata.dstatuswarn;
    this.statustaget = jsondata.dstatustaget;
    this.statustime = jsondata.dstatustime;
    this.statuslevel = jsondata.dstatuslevel;
    this.lat = jsondata.dlat;
    this.lng = jsondata.dlng;
    this.icon = jsondata.icon;
    this.transtatus = jsondata.actvalue;
  }
}


export class DatamoduleModule {}


export class DriveractiveModel {
  driverid: number;
  fullname: string;
  phone: string;

  constructor( )  {
    this.driverid= 0;
    this.fullname= "";
    this.phone= "";
  }
  
  setdata(jsondata :any){
    this.driverid= jsondata.driverid;
    this.fullname= jsondata.fullname;
    this.phone= jsondata.phone;
   
  }
  SetExamdata(){
     this.setdata({
      driverid: 145,
      fullname: "นาย อุเทน จุ้ยประโคน",
      phone: "0618138257"
    });    
  }
}

export class  PagekeyModel {
  cid:string;
  apistime:string;

  constructor(cid:string,apistime:string) {
    this.cid=cid;
    this.apistime=apistime;
  }
}