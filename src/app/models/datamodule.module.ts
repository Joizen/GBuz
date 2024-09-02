import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})

export class DatamoduleModule {}

export class CompanyDashboard {
  cid : number = 0;
  company : string = "";
  comadmin : number = 0;
  complogo : string = "";
  totaldo : number = 0;
  totalwake : number = 0;
  totaltemp : number = 0;
  totalalc : number = 0;
  totalstart : number = 0;
  totalotw : number = 0;
  totalfinish : number = 0;
  dolist: DoDashboard[]  = [];
  wakeuplist: DriverActivity[]  = [];
  unwakeuplist: DriverActivity[]  = [];
  showdetail:boolean=false;
  showicon:string="keyboard_arrow_up";
  
  constructor(){}

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


export class ProfileModel {
  id: number;
  fullname: string;
  empname: string;
  surname: string;
  phone: string;
  mobile: string;
  rolename: string;
  licent: string;
  expired: string;
  linename: string;
  lineimage: string;
  vid: number;
  vname: string;
  vlicent: string;

  constructor() {
    this.id = 0;
    this.fullname = "";
    this.empname = "";
    this.surname = "";
    this.phone = "";
    this.mobile = "";
    this.rolename = "";
    this.licent = "";
    this.expired = "2099-01-01";
    this.linename = "";
    this.lineimage = "";
    this.vid = 0;
    this.vname = "";
    this.vlicent = "";
    // ==========TEST =================
    // this.id = 0;
    // this.fullname = 'นาย บวร เทพสง่า';
    // this.empname = 'บวร';
    // this.surname = 'เทพสง่า';
    // this.phone = '0819255510';
    // this.mobile = '0892498158';
    // this.rolename = 'Driver';
    // this.licent = "";
    // this.expired = "2099-01-01";
    // this.linename = 'นายวอน';
    // this.lineimage = "https://profile.line-scdn.net/0hkyR8s9fKNFZ_QSAs04NKKQ8RNzxcMG1EACB_Y0hBP2JCcXUFWyd_N0tHbDVGdyAGU3N8NEhCaWFzUkMwYRfIYnhxaWdDdXICUS9zsg";
    // this.vid = 0;
    // this.vname = 'NDK-01';
    // this.vlicent = '30-4129 ชลบุรี';
  }

  setData(jsondata: any) {
    console.log('setData jsondata : ', jsondata);
    this.id = jsondata.id;
    this.fullname = jsondata.fullname;
    this.empname = jsondata.empname;
    this.surname = jsondata.surname;
    this.phone = jsondata.phone;
    this.mobile = jsondata.mobile;
    this.rolename = jsondata.rolename;
    this.licent = jsondata.license;
    this.expired = jsondata.expired;
    this.linename = jsondata.linename;
    this.lineimage = jsondata.lineimage;
    this.vid = jsondata.vid;
    this.vname = jsondata.vname;
    this.vlicent = jsondata.vlicense;
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
  cid : number = 0;
  driverid : number = 0;
  docode: string = "";
  lineimage : string = "";
  statusid : number = 0;
  statusname : string =  "";;
  statuswarn : string = "2000-01-01 00:00:00";
  statustaget : string = "2000-01-01 00:00:00";
  statustime : string = "2000-01-01 00:00:00";
  statuslevel : number = 0;
  lat : number = 0.0;
  lng : number = 0.0;
  icon : string =  "";
  transtatus : number = 0;
  constructor( ){}
  setdata(jsondata:any){
    this.cid = jsondata.cid;
    this.driverid = jsondata.driverid;
    this.docode= jsondata.docode;
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
    this.lineimage =jsondata.lineimage;
  }
}

export class DoDashboard {
  cid : number= 0;
  driverid : number= 0;
  fullname : string= "";
  phone : string= "";
  mobile : string= "";
  linename: string= "";
  lineimage: string= "";
  docode : string= "";
  workday : string= "";
  doname : string= "";
  routename : string= "";
  issend : number= 0;
  isendname : string= "";
  ot : number= 0;
  otname : string= "";
  shifid : number= 0;
  shift : string= "";
  vid : number= 0;
  vname : string= "";
  vlicent : string= "";
  startpoint : string= "";
  startpointname : string= "";
  starttext : string= "";
  starttime : string= "2000-01-01 00:00:00";
  finishtext : string= "";
  finishtime : string= "2000-01-01 00:00:00";
  listdp : string= "";
  listperiod : string= "";
  listdpemp : string= "";
  listemp : string= "";
  liststatus : string= "";
  totalemp : number= 0;
  nextwarn : string= "";
  nextwarntime : string= "2000-01-01 00:00:00";
  nexttaget : string= "";
  nextstatus : string= "";
  nextstatusname : string= "";
  nexttagettime : string= "2000-01-01 00:00:00";
  nextlat : number= 0;
  nextlng : number= 0;
  nexticon : string= "";
  wakestatus : boolean= false;
  listactivity : DriverActivity[]= []; 
  constructor( ){}

  setdata(jsondata:any){
    this.driverid = jsondata.driverid;
    this.fullname = jsondata.fullname;
    this.linename = jsondata.linename;
    this.lineimage= jsondata.lineimage;
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
    this.starttime = jsondata.starttime;
    this.finishtext = jsondata.finishtext;
    this.finishtime = jsondata.finishtime;
    this.listdp = jsondata.listdp;
    this.listperiod = jsondata.listperiod;
    this.listdpemp = jsondata.listdpemp;
    this.listemp = jsondata.listemp;
    this.liststatus = jsondata.liststatus;
    this.totalemp = jsondata.totalemp;
    // this.nextwarn = jsondata.nextwarn;
    // this.nextwarntime = jsondata.nextwarntime;
    // this.nexttaget = jsondata.nexttaget;
    // this.nextstatus = jsondata.nextstatus;
    // this.nextstatusname = jsondata.nextstatusname;
    // this.nexttagettime = jsondata.nexttagettime;
    // this.nextlat = jsondata.nextlat;
    // this.nextlng = jsondata.nextlng;
    // this.nexticon = jsondata.nexticon;
  }
}

export class Dashboarddata {
  cid : number= 0;
  companyname : string= "";
  driverid : number= 0;
  docode : string= "";
  workday : string= "";
  doname : string= "";
  routename : string= "";
  issend : number= 0;
  isendname : string= "";
  ot : number= 0;
  otname : string= "";
  shifid : number= 0;
  shift : string= "";
  fullname : string= "";
  phone : string= "";
  mobile : string= "";
  linename: string= "";
  lineimage: string= "";
  vid : number= 0;
  vname : string= "";
  vlicent : string= "";
  startpoint : string= "";
  startpointname : string= "";
  starttext : string= "";
  starttime : string= "2000-01-01 00:00:00";
  finishtext : string= "";
  finishtime : string= "2000-01-01 00:00:00";
  listdp : string= "";
  listperiod : string= "";
  listdpemp : string= "";
  listemp : string= "";
  liststatus : string= "";
  totalemp : number= 0;
  dstatus : number= 0;
  dstatusname : string= "";
  dstatuswarn : string= "2000-01-01 00:00:00";
  dstatustaget : string= "2000-01-01 00:00:00";
  dstatustime : string= "2000-01-01 00:00:00";
  dstatuslevel : number=0;
  dlat : number =0.0;
  dlng : number=0.0;
  icon : string= "";
  actvalue : number=0;
  activitylog:DriverActivity[]=[];
  constructor(){}
  setdata(jsondata:any ){
    this.driverid = jsondata.driverid;
    this.fullname = jsondata.fullname;
    this.linename = jsondata.linename;
    this.lineimage= jsondata.lineimage;
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
    this.dstatus = jsondata.dstatus;
    this.dstatusname = jsondata.dstatusname;
    this.dstatuswarn = jsondata.dstatuswarn;
    this.dstatustaget = jsondata.dstatustaget;
    this.dstatustime = jsondata.dstatustime;
    this.dstatuslevel = jsondata.dstatuslevel;
    this.dlat = jsondata.dlat;
    this.dlng = jsondata.dlng;
    this.icon = jsondata.icon;
    this.actvalue = jsondata.actvalue;
  }
}

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