import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';
import { Dashboarddata,ProfileModel,DoCompany,DoData,DoActivity,VehicleDashboard} from '../../../models/datamodule.module';
import mqtt, { MqttClient } from 'mqtt';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import { elementAt } from 'rxjs';


@Component({
  selector: 'app-maindashboardpage',
  templateUrl: './maindashboardpage.component.html',
  styleUrls: ['./maindashboardpage.component.scss']
})

export class MaindashboardpageComponent implements OnInit {
  
   constructor(
     private modalService: NgbModal,
     public va: variable,
     private dialog: MatDialog,
     private snacbar: MatSnackBar
   ) {}
 
   show = {
     Refreshpage: false,
     Spinner: true,
     Profile: false,
     Driverwork: false,
   };
   UserProfile = new ProfileModel();
  //  public activedashboad: CompanyDashboard[] = [];
  //  public listdashboad: Dashboarddata[] = [];
   public activedriver: DoData = new DoData();
   public mqttClient: any;
   public style: object = {};
   public modal:any
   private map: L.Map | undefined;
   private mapIconSize = 30;
   private vmarkers: { id: number, marker: L.Marker }[] = [];
   private cmarkers: L.Marker| undefined;
   public listdostatus :Dashboarddata[]=[];
   public listdashboadcom: DoCompany[] = [];
   public listdashboaddo: DoData[]=[];
   public listcompimage: any=[];
   public listdashboadvehicle: VehicleDashboard[]=[];


   public showtype=2;

   async ngOnInit() {
     // this.initLineToken();
    //  this.getdashboarddata();

     this.initMap();
     this.mqttClient = await this.connectMqtt();
     this.subscribeMqtt(this.mqttClient, 'gbdupdate');
     this.subscribeMqtt(this.mqttClient, 'gbvupdate');
     await this.getactivedo();
   }
 
   //----------------- Dash board Data ---------------------------------------
   async getactivedo() {
    // //---------test------------
    var wsname = '_getdata';
    var params = { tbname: 'driverdashboard', uid: 135 };
    var jsondata = await this.va.WsData(wsname, params, '');
    this.show.Spinner = false;

    // var wsname = "getdata";
    // var params = { tbname: "driverdashboard" };
    // var jsondata = await this.va.getWsData(wsname, params);

    console.log('getdashboarddata : ', jsondata);
    if (jsondata.code == '000') {
      this.listdostatus = await this.getlistdostatus(jsondata.data);
      console.log('getdashboarddata this.listdostatus :', this.listdostatus);
      var result = await this.setcompanydata();
      console.log('getdashboarddata result :', result);
      this.listdashboadcom = result.listcom;
      await this.getimagedata(result.listcomid);
      this.listdashboadvehicle = await this.getvehicledata(result.listvehicle);
      this.plotvehecle();
    }
  }

  async getlistdostatus(jsondata:any){ 
    var result:Dashboarddata[]= [];
    try{
      jsondata.forEach((item: any) => {
        var temp = new Dashboarddata();
        temp.setdata(item);
        result.push(temp);
      });  
    }catch(ex){console.log("getlistdostatus error :",ex)}
    return result;
  }

  async setcompanydata(){  
    var listcom:DoCompany[] =[];
    var listvehicle = "";
    var listcomid = "";
    
    try{
      // จัดข้อมูล Dostatus ทุก DO ลงใน listdo พร้อมสร้างข้อมูล Company
      const ld = this.listdostatus.reduce((acc: any, item: any) => {
        // ตรวจสอบว่ามีหมวดหมู่นี้ใน accumulator หรือไม่
        if (!acc[item.docode]) {
          // ถ้ายังไม่เคยมี DO ให้สร้าง DO ใบใหม่
          var dodata = new DoData();
          dodata.setdata(item);
          // เก็บค่า serialbox สำหรับใช้หาข้อมูลรถจาก GPS Gateway
          listvehicle += ((listvehicle==""?"'" : ",'") + dodata.serialbox +"'")
          // ตรวจดูว่าทำ Activity ขั้นตอนไหนไปบ้างแล้ว 
          var act = this.listdostatus.filter((x) => x.docode == dodata.docode);
          if(act){
            act.forEach(actitem => {
              var statusitem:DoActivity = new DoActivity();
              statusitem.setdata(actitem) ;
              statusitem.showtime= (statusitem.transtatus==1?this.va.DateToString("HH:mm",statusitem.statustime) :"");            
              if(statusitem.statusid==5){ dodata.wakeup=statusitem.transtatus;dodata.wakeupshowtime=statusitem.showtime;}
              else if(statusitem.statusid==10){ dodata.alc=statusitem.transtatus;dodata.alcshowtime=statusitem.showtime;}
              else if(statusitem.statusid==15){ dodata.temp=statusitem.transtatus; dodata.tempshowtime=statusitem.showtime;}
              else if(statusitem.statusid==20){ dodata.start=statusitem.transtatus;dodata.startshowtime=statusitem.showtime;}
              else if(statusitem.statusid==25){ dodata.otw=statusitem.transtatus;dodata.otwshowtime=statusitem.showtime;}
              else if(statusitem.statusid==30){ dodata.finish=statusitem.transtatus;dodata.finishshowtime==statusitem.showtime;}
              dodata.listactivity.push(statusitem);              
            });  
            // console.log('dodata',dodata);
          }
           // เช็คดูว่าทำ Activity ขั้นตอนสุดท้ายคืออะไร 
          const actsuccess = dodata.listactivity.filter(item => item.transtatus === 1);
          if(actsuccess){
            const maxItem:DoActivity = actsuccess.reduce((prev, current) => {
              return current.statusid > prev.statusid ? current : prev;
            }, actsuccess[0]);
            if(maxItem){
              dodata.laststatus=maxItem.statusid;
              var nextstep = (dodata.laststatus==10?10:5)
              dodata.nextstatus= (dodata.laststatus+nextstep);
            }
          }
          dodata.statuscorlor=this.va.getstatuscolor(dodata.laststatus);    

          // เพิ่มข้อมูล do ลงไปใน listdo    
          this.listdashboaddo.push(dodata);
          
          // ตรวจสอบว่าเคยสร้างข้อมูลบริษัทแล้วหรือยัง
          var comp= listcom.find((x) => x.cid == dodata.cid);
          if(!comp){
            // ถ้าไม่มีให้สร้างข้อมูลบริษัท และเก็บไว้ใน listcom
            comp=new DoCompany();
            comp.setdata(item);
            listcom.push(comp);
          }

          acc[item.docode] = [];// ถ้ายังไม่มี ให้สร้างอาร์เรย์ว่างสำหรับหมวดหมู่นั้น ==>listdostatus.reduce((acc: any, item: any)
        }
        return acc;
      }, {} as { [key: string]: any[] });
       
      console.log("listdo :", this.listdashboaddo);
      console.log("listcom :", listcom);

      // คำนวนค่าข้อมูลลงใน Company
      listcom.forEach((comp: any) => {
        listcomid+=((listcomid==""?"'":",'") + comp.cid + "'" );
        comp.dolist =this.listdashboaddo.filter(x=>x.cid==comp.cid);
        comp.totaldo = comp.dolist.length;
        var liststatus = [5, 10, 15, 20, 25, 30];
        liststatus.forEach((id) => {
          var successdata = this.listdostatus.filter( x => x.cid == comp.cid && x.dstatus == id && x.actvalue == 1);
          var totalsuccess = 0;
          if (successdata) {totalsuccess = successdata.length;}
          if (id == 5) { comp.totalwake = totalsuccess;} 
          else if (id == 10) { comp.totalalc = totalsuccess; } 
          else if (id == 15) { comp.totaltemp = totalsuccess; } 
          else if (id == 20) { comp.totalstart = totalsuccess;} 
          else if (id == 25) { comp.totalotw = totalsuccess; } 
          else if (id == 30) { comp.totalsuccess = totalsuccess; }
        });
        comp.unwakelist = comp.dolist.filter((x:DoData)=>x.wakeup==0); 
        comp.finishlist = comp.dolist.filter((x:DoData)=>x.finish==1); 
        comp.otwlist = comp.dolist.filter((x:DoData)=>x.otw==1 && x.finish==0); 
        comp.startlist = comp.dolist.filter((x:DoData)=>x.start==1 && x.otw==0 &&x.finish==0); 
        comp.alclist = comp.dolist.filter((x:DoData)=>x.alc==1 && x.start==0 && x.otw==0 &&x.finish==0); 
        comp.templist = comp.dolist.filter((x:DoData)=>x.temp==1 && x.start==0 && x.otw==0 &&x.finish==0); 
        comp.wakelist =  comp.dolist.filter((x:DoData)=>x.wakeup==1 && x.alc==0 && x.start==0 && x.otw==0 &&x.finish==0); 
        comp.dolist.sort((a:any, b:any) => {
          if (a.wakeup === b.wakeup) {
            // Check alc
            if (a.alc === b.alc) {
              // Check start
              if (a.temp === b.temp) {
                  // Check start
                if (a.start === b.start) {
                  // Check otw
                  if (a.otw === b.otw) {                    
                    return a.finish-b.finish; // Sort start in descending order
                  } else {
                    return a.otw - b.otw; // Sort alc in ascending order
                  }
                } else {
                  return a.start - b.start; // Sort alc in ascending order
                }
              } else {
                return a.temp - b.temp; // Sort alc in ascending order
              }
            } else {
              return a.alc - b.alc; // Sort alc in ascending order
            }
          } else {
            return a.wakeup - b.wakeup; // Sort wake in ascending order
          }
        });

      });

    }catch(ex){console.log('setcompanydata error',ex);}

    return({listcom:listcom,listvehicle:listvehicle,listcomid:listcomid});
  } 

  setactgroup(compid:number){
    var comp = this.listdashboadcom.find(x=>x.cid==compid);
    if(comp){
      comp.unwakelist = comp.dolist.filter((x:DoData)=>x.wakeup==0); 
      comp.finishlist = comp.dolist.filter((x:DoData)=>x.finish==1); 
      comp.otwlist = comp.dolist.filter((x:DoData)=>x.otw==1 && x.finish==0); 
      comp.startlist = comp.dolist.filter((x:DoData)=>x.start==1 && x.otw==0 &&x.finish==0); 
      comp.alclist = comp.dolist.filter((x:DoData)=>x.alc==1 && x.start==0 && x.otw==0 &&x.finish==0); 
      comp.wakelist =  comp.dolist.filter((x:DoData)=>x.wakeup==1 && x.alc==0 && x.start==0 && x.otw==0 &&x.finish==0); 
      comp.totaldo = comp.dolist.length;
      comp.totalwake= comp.dolist.filter( x =>x.wakeup == 1).length;
      comp.totalalc= comp.dolist.filter( x =>x.alc == 1).length;
      comp.totaltemp= comp.dolist.filter( x =>x.temp == 1).length;
      comp.totalstart= comp.dolist.filter( x =>x.start == 1).length;
      comp.totalotw= comp.dolist.filter( x =>x.otw == 1).length;
      comp.totalfinish= comp.dolist.filter( x =>x.finish == 1).length;
      comp.dolist.sort((a:any, b:any) => {
        if (a.wakeup === b.wakeup) {
          // Check alc
          if (a.alc === b.alc) {
            // Check start
            if (a.temp === b.temp) {
                // Check start
              if (a.start === b.start) {
                // Check otw
                if (a.otw === b.otw) {                    
                  return a.finish-b.finish; // Sort start in descending order
                } else {
                  return a.otw - b.otw; // Sort alc in ascending order
                }
              } else {
                return a.start - b.start; // Sort alc in ascending order
              }
            } else {
              return a.temp - b.temp; // Sort alc in ascending order
            }
          } else {
            return a.alc - b.alc; // Sort alc in ascending order
          }
        } else {
          return a.wakeup - b.wakeup; // Sort wake in ascending order
        }
      });
    }
  }

  async getimagedata(listcom:string) {
    if (this.listcompimage.length == 0){
      var wsname = '_getdata';
      var params = { tbname: 'companylogo', listcid: listcom };
      var header = '';
      var jsondata = await this.va.WsData(wsname, params, header);
      if (jsondata.code == '000') {
       this.listcompimage = jsondata.data;       
      }
    } 
    if (this.listcompimage.length > 0) {
      this.listcompimage.forEach((item: any) => {
         var comp = this.listdashboadcom.find((x) => x.cid == item.id);
         if (comp) {
           comp.complogo = item.img;
         }
       });
     }
  }
  
  async getvehicledata(listvehicle:string) {
    var result:VehicleDashboard[] = []
    try{
      var wsname = 'getrealtimedata';
      var params = { tbname: 'vehiclerealtime', listserial: listvehicle };
      var header = '';
      var jsondata = await this.va.WsData(wsname, params, header);
      if (jsondata.code == '000') {
        console.log("getvehicledata jsondata : ",jsondata.data);
        if (jsondata.data.length > 0) {          
          jsondata.data.forEach((item: any) => {
            var v:VehicleDashboard = new VehicleDashboard();
            v.setdata(item);
            result.push(item);
            var vdo = this.listdashboaddo.filter(x=>x.serialbox==v.serialbox);
            if(vdo){
              vdo.forEach(mydo => {
                mydo.vlat =v.lat;
                mydo.vlng =v.lng;
                mydo.vstatus =v.gpsstatus;
                mydo.vlocation =v.adminname;
                mydo.vlocationcode =v.admincode;
                mydo.vspeed =v.speed;
                mydo.vheader =v.header;
                mydo.vio =v.io;
                mydo.vstatuscorlor = this.va.getvcolor(v.gpsstatus);
                mydo.vstatusname = this.va.getvstatusname(v.gpsstatus);
              });
            }
          });
        }
      }
      console.log(this.listdashboaddo);
  
    }catch(ex){console.log("getvehicledata error : ",ex)}
    return result;
  }

  setVehiclePointindo(vehicle:any){
    try{
      var v:VehicleDashboard = new VehicleDashboard();
      v.setdata(vehicle);
      for(var i;i=this.listdashboadcom.length;i++){
        var comp =this.listdashboadcom[i];
        for(var j;j=comp.dolist.length;j++){
          var mydo = comp.dolist[j];
          if(mydo.serialbox==v.serialbox){
            mydo.vlat =v.lat;
            mydo.vlng =v.lng;
            mydo.vstatus =v.gpsstatus;
            mydo.vlocation =v.adminname;
            mydo.vlocationcode =v.admincode;
            mydo.vspeed =v.speed;
            mydo.vheader =v.header;
            mydo.vio =v.io;
            return true;
          }
        }
      };
    }catch(ex){console.log("getvehicledata error : ",ex)}
    return false;
  }

  showdiverwork(driver: DoData,comp :DoCompany, modal:any) {
    this.activedriver=driver;
    this.activedriver.complogo=comp.complogo;
    this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes

    // ================ test  remove 

  }

  async driverdetailtalkback(event: any) {
    var dodata = event.do;
    var transtatus = event.transtatus;

    console.log("driverdetailtalkback : dodata ",dodata);
    console.log("driverdetailtalkback : transtatus ",transtatus);
    if(transtatus==1){
      // this.ChangeStatus(dodata.cid,dodata.docode,dodata.nextstatus,transtatus);
    }else{
      // this.ChangeStatus(dodata.cid,dodata.docode,dodata.laststatus,transtatus);
    }

    // var updatestatus:number = dochange.nextstatus;
  //   if(dochange){
  //     var doc = this.listdashboaddo.find(x=>x.docode==dochange.docode);
  //     var com = this.listdashboadcom.find(x=>x.cid==dochange.cid);
  //     if(doc&&com){
  //       var nextstep=(updatestatus==10?10:5);
  //       doc.nextstatus += nextstep; 
  //       doc.statuscorlor = this.va.getstatuscolor(updatestatus);   
  //       if(updatestatus==5){
  //         doc.wakeup =1;
  //         doc.wakeupshowtime = this.va.DateToString("HH:mm",new Date) ;
  //         var index = com.unwakelist.findIndex(x=>x.docode==dochange.docode)
  //         if(index){
  //           com.wakelist.push(doc);
  //           com.unwakelist.splice(index,1);
  //         }
  //       }
  //       if(updatestatus==10){
  //         doc.alc =1;
  //         doc.alcshowtime = this.va.DateToString("HH:mm",new Date) ;
  //         var index = com.wakelist.findIndex(x=>x.docode==dochange.docode)
  //         if(index){
  //           com.alclist.push(doc);
  //           com.wakelist.splice(index,1);
  //         }
  //       }
  //       if(updatestatus==15){
  //         doc.temp =1;
  //         doc.tempshowtime = this.va.DateToString("HH:mm",new Date) ;
  //         var index = com.wakelist.findIndex(x=>x.docode==dochange.docode)
  //         if(index){
  //           com.alclist.push(doc);
  //           com.wakelist.splice(index,1);
  //         }
  //       }
  //       if(updatestatus==20){
  //         doc.start =1;
  //         doc.startshowtime = this.va.DateToString("HH:mm",new Date) ;
  //         var index = com.alclist.findIndex(x=>x.docode==dochange.docode)
  //         if(index){
  //           com.startlist.push(doc);
  //           com.alclist.splice(index,1);
  //         }
  //       }
  //       if(updatestatus==25){
  //         doc.otw =1;
  //         doc.otwshowtime = this.va.DateToString("HH:mm",new Date) ;
  //         var index = com.startlist.findIndex(x=>x.docode==dochange.docode)
  //         if(index){
  //           com.otwlist.push(doc);
  //           com.startlist.splice(index,1);
  //         }
  //       }
  //       if(updatestatus==30){
  //         doc.finish =1;
  //         doc.finishshowtime = this.va.DateToString("HH:mm",new Date) ;
  //         var index = com.otwlist.findIndex(x=>x.docode==dochange.docode)
  //         if(index){
  //           com.finishlist.push(doc);
  //           com.otwlist.splice(index,1);
  //         }
  //       }
  //     }
      
  //  }
  //   console.log("driverdetailtalkback : this.activedriver ",this.activedriver);
    
  }

  ChangeStatus(cid:number,docode:string, updatestatus:number,transtatus:number){
    console.log("ChangeStatus :"+cid +","+docode+","+ updatestatus+","+transtatus)
          // var doc = this.listdashboaddo.find(x=>x.docode==docode);
          var com = this.listdashboadcom.find(x=>x.cid==cid);
          if(com){
            var doc = com.dolist.find(x=>x.docode==docode);
            if(doc){            
              var act = doc.listactivity.find(x=>x.statusid==updatestatus);
              if(act){
                act.transtatus=transtatus;
                act.showtime =(transtatus==0?"":this.va.DateToString("HH:mm",new Date));
              }
              if(transtatus==1){
                var nextstep=(updatestatus==10?10:5);
                doc.nextstatus = (updatestatus+nextstep); 
                doc.laststatus = updatestatus;
                doc.statuscorlor = this.va.getstatuscolor(updatestatus);
              }else{ 
                var nextstep=((updatestatus==15||updatestatus== 20)?10:5);
                doc.nextstatus=updatestatus;
                doc.laststatus = (updatestatus-nextstep);
                doc.statuscorlor = this.va.getstatuscolor(doc.laststatus);   
              }
              if(updatestatus==5){
                doc.wakeup =transtatus;
                if(transtatus==1){
                  doc.wakeupshowtime = this.va.DateToString("HH:mm",new Date) ;
                  var index = com.unwakelist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.wakelist.push(doc);
                    com.unwakelist.splice(index,1);
                  }  
                }else{
                  doc.wakeupshowtime = "";
                  var index = com.wakelist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.unwakelist.push(doc);
                    com.wakelist.splice(index,1);
                  }
                }
              }
              else if(updatestatus==10){
                doc.alc =transtatus;
                if(transtatus==1){
                  doc.alcshowtime = this.va.DateToString("HH:mm",new Date) ;
                  var index = com.wakelist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.alclist.push(doc);
                    com.wakelist.splice(index,1);
                  }
                }
                else{
                  doc.alcshowtime = "";
                  var index = com.alclist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.wakelist.push(doc);
                    com.alclist.splice(index,1);
                  }
                }
              }
              else if(updatestatus==15){
                doc.temp = transtatus;
                if(transtatus==1){
                  doc.tempshowtime = this.va.DateToString("HH:mm",new Date) ;
                  var index = com.wakelist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.alclist.push(doc);
                    com.wakelist.splice(index,1);
                  }
                }
                else{
                  doc.tempshowtime = "";
                  var index = com.alclist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.wakelist.push(doc);
                    com.alclist.splice(index,1);
                  }
                }
                
              }
              else if(updatestatus==20){
                doc.start =transtatus;
                if(transtatus==1){
                  doc.startshowtime = this.va.DateToString("HH:mm",new Date) ;
                  var index = com.alclist.findIndex(x=>x.docode==docode)
                  console.log("20 index : ",index);
                  if(index){
                    com.startlist.push(doc);
                    com.alclist.splice(index,1);
                  }
                }
                else{
                  doc.startshowtime = "";
                  var index = com.startlist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.alclist.push(doc);
                    com.startlist.splice(index,1);
                  }
                }
              }
              else if(updatestatus==25){
                doc.otw =transtatus;
                if(transtatus==1){
                  doc.otwshowtime = this.va.DateToString("HH:mm",new Date) ;
                  var index = com.startlist.findIndex(x=>x.docode==docode)
                  console.log("25 index : ",index);
  
                  if(index){
                    com.otwlist.push(doc);
                    com.startlist.splice(index,1);
                  }
                }
                else{
                  doc.otwshowtime = "";
                  var index = com.otwlist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.startlist.push(doc);
                    com.otwlist.splice(index,1);
                  }
                }
              }
              else if(updatestatus==30){
                doc.finish =transtatus;
                if(transtatus==1)
                {
                  doc.finishshowtime = this.va.DateToString("HH:mm",new Date) ;
                  var index = com.otwlist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.finishlist.push(doc);
                    com.otwlist.splice(index,1);
                  }
                }
                else{
                  doc.finishshowtime = "";
                  var index = com.finishlist.findIndex(x=>x.docode==docode)
                  if(index){
                    com.otwlist.push(doc);
                    com.finishlist.splice(index,1);
                  }
                }
              }
              console.log("doc.laststatus : ",doc.laststatus);
              com.dolist.sort((a:any, b:any) => {
                if (a.wakeup === b.wakeup) {
                  // Check alc
                  if (a.alc === b.alc) {
                    // Check start
                    // if (a.temp === b.temp) {
                        // Check start
                      if (a.start === b.start) {
                        // Check otw
                        if (a.otw === b.otw) {                    
                          return a.finish-b.finish; // Sort start in descending order
                        } else {
                          return a.otw - b.otw; // Sort alc in ascending order
                        }
                      } else {
                        return a.start - b.start; // Sort alc in ascending order
                      }
                    // } else {
                      // return a.temp - b.temp; // Sort alc in ascending order
                    // }
                  } else {
                    return a.alc - b.alc; // Sort alc in ascending order
                  }
                } else {
                  return a.wakeup - b.wakeup; // Sort wake in ascending order
                }
              });
  
            }
            }
          
       

  }


  showdriverposition(driver: any){
    try{
      console.log("showdriverposition :"+ driver.vlat, driver.vlng);
      if(driver.vlat!=0&&driver.vlng!=0){
        console.log("showdriverposition driver :", driver);
        if(this.map){
          this.map.panTo([driver.vlat,driver.vlng]);
          this.map.setZoom(15);
          this.ShowCurrentPosition(driver.vlat, driver.vlng)
        }
      }  
      else{
        this.showSanckbar("No Position data",2)
      }
    }catch(ex){console.log("showdriverposition error :", ex);}
  }
 
   //--------------------- MQTT  Lissening------------------------
   mqttconfig = this.va.mqttconfig;
   async connectMqtt() {
     try {
       var mqttclient = await mqtt.connect(this.mqttconfig.url, {
         clientId: 'client_' + Math.floor(Math.random() * 10000),
         username: this.mqttconfig.username,
         password: this.mqttconfig.password,
       });
       mqttclient.on('message', (receivedTopic: string, message: any) => {
         this.decodemqtt(receivedTopic, message);
       });
       return mqttclient;
     } catch (ex) {
       console.log('Error ========> ', ex);
     }
     return null;
   }

   async subscribeMqtt(mqttclient: MqttClient, topic: string) {
     try {
       if (mqttclient) {
           mqttclient.subscribe(topic, { qos: 0 }, (err: any) => {
           if (err) {
             console.log('err');
           } else {
             console.log('Subscribed');
           }
         });
       } else {
         console.log('MQTT client is not connected.');
       }
     } catch (ex) {
       console.log('Error ========> ', ex);
     }
   }
   //--------------------- MQTT  Send -----------------------
   async sendMQTT(topic: string, message: any, mqttclient: MqttClient) {
     try {
       if (!mqttclient || mqttclient.disconnected) {
         mqttclient = await mqtt.connect(this.mqttconfig.url, {
           clientId: 'client_' + Math.floor(Math.random() * 10000),
           username: this.mqttconfig.username,
           password: this.mqttconfig.password,
         });
       }
       mqttclient.publish(topic, message);
       return true;
     } catch (ex) {
       console.log('sendMessage error : ', ex);
     }
     return false;
   }
 
   async decodemqtt(topic: string, message: string) {
     if (topic === 'gbdupdate') {
       const msg = message.toString();
       var data = JSON.parse(msg);
       console.log('decodemqtt data: ', data);
       this.ChangeStatus(data.compid,data.docode,data.statusid,data.value);
     } else if (topic === 'gbvupdate') {
     }
   }


 
   //--------------------- Leaflet  Map------------------------
   private initMap(): void {
     this.map = L.map('map', {
       center: [13.6140328, 100.6162229], // Latitude and longitude of the center point
       zoom: 13, // Initial zoom level
       layers: [
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           maxZoom: 19,
           attribution: '© OpenStreetMap',
         }),
       ],
     });
   }
 
   plotvehecle(){
    var lastpoint:any =[13,100];
    this.listdashboaddo.forEach(vehicle => {
      if(vehicle.vlat!=0&&vehicle.vlng!=0){
        var details = vehicle.doname
        var marker = this.plotMarker(vehicle.vlat,vehicle.vlng,vehicle.fullname,details,vehicle.lineimage,vehicle.vstatuscorlor);
        if(marker!=null){
          var id:number = vehicle.vid;
          this.vmarkers.push({id, marker});
          lastpoint=[vehicle.vlat,vehicle.vlng];
        }
      }
    });
    if(this.map){this.map.panTo(lastpoint);}  
    this.vmarkers
   }

   private plotMarker(lat:any,lng:any,header:string,description:string,image:any,vstatus:string){
    if(this.map){     
      // var vstatus ="#fa0404"; 
      const customIcon = L.divIcon({
        html:`<div style="position: relative; width:${this.mapIconSize}px; height:${(this.mapIconSize*2)}px; display: flex;">'+
                <img src="${this.va.icon.poi}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
                <img src="${image}" style="position: absolute; top: 5%; left: 10%; width: 80%; height: 40%;  border-radius: 50%; z-index: 2; opacity: 1.0;" />
                <div style="position: absolute; bottom: 0%; left: 35%; width: 30%; height: 30%;  border-radius: 50%; z-index: 2; opacity: 1.0; background-color:${vstatus}"  />
              </div>`,
        className: '', // Remove default styling
        iconSize: [this.mapIconSize, this.mapIconSize*2], // Adjust size for side-by-side images
      });  
      var htmlPopup:string = `<div class='container'>   
                                <div class'row no-gutter' style='display: flex;'>
                                  <center><p><strong>${header}</strong></p></center>
                                </div> 
                                  <div class'row no-gutter'>
                                    <div class'col-3'> 
                                    <img style='width: 50px; height: 50px;' src='${image}'/> 
                                    </div> 
                                    <div class'col-8'> 
                                    <p>${description}</p>
                                  </div>
                                </div>  
                              </div>`
      const marker =L.marker([lat,lng],{ icon: customIcon }).addTo(this.map)
      .bindPopup(htmlPopup);

      marker.on('popupopen', function() {
        setTimeout(() => {marker.closePopup(); }, 3000); // 3000ms = 3 seconds
      });
      const resizeMarkerIcon = () => {
        const zoomLevel = this.map?.getZoom();
        
        // Calculate new size based on zoom level (adjust the scaling factor as needed)
        const zl = zoomLevel?zoomLevel:13;
        const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level
      
        // Update the marker icon size
        marker.setIcon(
          L.divIcon({
            html:`<div style="position: relative; width:${newSize}px; height:${(newSize*2)}px; display: flex;">
                    <img src="${this.va.icon.poi}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
                    <img src="${image}" style="position: absolute; top: 5%; left: 10%; width: 80%; height: 40%;  border-radius: 50%; z-index: 2; opacity: 1.0;" />
                    <div style="position: absolute; bottom: 0%; left: 35%; width: 30%; height: 30%;  border-radius: 50%; z-index: 2; opacity: 1.0; background-color:${vstatus}"  />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
          })
        );
      };
      
      this.map.on('zoom', resizeMarkerIcon);
      return marker;
    }
    return null;
   }

   private ShowCurrentPosition(lat:any,lng:any){
    try{
      if(this.map){   
        if(this.cmarkers){
          this.cmarkers.setLatLng([lat,lng]);
        } 
        else{
          const zoomLevel = this.map?.getZoom();
          const zl = zoomLevel?zoomLevel:13;
          const newSize = this.mapIconSize * (zl / 13); 
          const customIcon = L.divIcon({
            html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                    <img src="${this.va.icon.thispoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
            iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
          });    
          this.cmarkers =L.marker([lat,lng],{ icon: customIcon }).addTo(this.map);

          setTimeout(() => {
            if(this.cmarkers){ 
              this.cmarkers.remove();
              this.cmarkers=undefined;
            }
          }, 3000); // 3000 milliseconds = 3 seconds
        }  
      }
    }catch(ex){console.log("ShowCurrentPosition error : ",ex)}

   }

   openmap(modal: any) {
     this.modalService.open(modal, { fullscreen:true});
   }
 
   showSanckbar(message: string, duration = 5) {
     this.snacbar.open(message, 'Close', {
       duration: duration * 1000,
       horizontalPosition: 'center',
       verticalPosition: 'bottom',
     });
   }
 

 }
 