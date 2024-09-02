import { Component, OnInit, ViewChild } from '@angular/core';
import { variable } from '../../variable';
import { Dashboarddata, DoDashboard, DriverActivity, CompanyDashboard, ProfileModel } from '../../models/datamodule.module'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import mqtt, { MqttClient } from 'mqtt';
import { elementAt } from 'rxjs';

@Component({
  selector: 'app-wakeupdashboard',
  templateUrl: './wakeupdashboard.component.html',
  styleUrls: ['./wakeupdashboard.component.scss']
})
export class WakeupdashboardComponent implements OnInit {

  constructor(private http: HttpClient, public va: variable) { }

  public wsUrl: string = "http://localhost:9080/";

  show = { Spinner: true, Profile: false, Driverwork: false };
  UserProfile = new ProfileModel();
  ShowDriverlist = "keyboard_arrow_down";
  public activedashboad: CompanyDashboard[] = [];
  public listdashboad: Dashboarddata[] = [];
  public activedriver: Dashboarddata = new Dashboarddata();
  public mqttClient: any;
  public activecomp : CompanyDashboard = new CompanyDashboard();

  async ngOnInit() {
    this.show.Spinner = false;
    this.getdashboarddata();

    this.mqttClient = await this.connectMqtt();
    this.subscribeMqtt(this.mqttClient, "gbdupdate");
    this.subscribeMqtt(this.mqttClient, "gbvupdate");
  }


  //----------------- Dash board Data ---------------------------------------
  ShowDriverlistClick(company: CompanyDashboard) {
    company.showdetail = !company.showdetail;
    company.showicon = company.showdetail ? "keyboard_arrow_down" : "keyboard_arrow_up";
    this.activecomp = company;
  }
  async getdashboarddata() {
    var wsname = "getdata";
    var params = { tbname: "driverdashboard", uid: '135' };
    var jsondata = await this.va.WsData(wsname, params, "");
    console.log("getdashboarddata", jsondata);
    if (jsondata.code == "000") {
      this.listdashboad = [];
      var listact: DriverActivity[] = [];
      jsondata.data.forEach((item: any) => {
        var temp = new Dashboarddata();
        temp.setdata(item);
        this.listdashboad.push(temp);
        var act = new DriverActivity();
        act.setdata(item);
        listact.push(act);
      });

      var listdo: DoDashboard[] = [];
      const ld = this.listdashboad.reduce((acc: any, item: any) => {
        // ตรวจสอบว่ามีหมวดหมู่นี้ใน accumulator หรือไม่
        if (!acc[item.docode]) {
          var dodata = new DoDashboard();
          dodata.setdata(item);
          var act = listact.filter(x => x.docode == item.docode);
          dodata.listactivity = act;
          var wake = act.find(x => x.statusid == 5);
          if (wake) { dodata.wakestatus = (wake.transtatus == 1) }
          listdo.push(dodata);
          acc[item.docode] = []; // ถ้ายังไม่มี ให้สร้างอาร์เรย์ว่างสำหรับหมวดหมู่นั้น
        }
        // acc[item.driverid].push(item); // เพิ่มข้อมูลในหมวดหมู่ที่เกี่ยวข้อง
        return acc;
      }, {} as { [key: string]: any[] });

      // console.log("listdo",listdo);

      this.activedashboad = [];
      const lc = this.listdashboad.reduce((acc: any, item: any) => {
        // ตรวจสอบว่ามีหมวดหมู่นี้ใน accumulator หรือไม่
        if (!acc[item.cid]) {
          var comp = new CompanyDashboard();
          comp.setdata(item);
          var dolist = listdo.filter(x => x.cid == item.cid);
          comp.dolist = dolist;
          var wakeup = listact.filter(x => x.cid == item.cid && x.statusid == 5 && x.transtatus == 1);
          comp.wakeuplist = wakeup;
          var unwakeup = listact.filter(x => x.cid == item.cid && x.statusid == 5 && x.transtatus == 0);
          comp.unwakeuplist = unwakeup;
          this.activedashboad.push(comp);
          acc[item.cid] = []; // ถ้ายังไม่มี ให้สร้างอาร์เรย์ว่างสำหรับหมวดหมู่นั้น

        }
        return acc;
      }, {} as { [key: string]: any[] });

      await this.getimagedata()
      this.activedashboad.forEach((item: any) => {
        item.totaldo = item.wakeuplist.length + item.unwakeuplist.length;
        item.totalwake = item.wakeuplist.length;
      });
      console.log("this.activedashboad", this.activedashboad);

    }
  }
  async getimagedata() {
    var listcom = "";
    for (var i = 0; i < this.activedashboad.length; i++) {
      listcom += ((listcom == "" ? "'" : ",'") + this.activedashboad[i].cid + "'");
    }
    var wsname = "getdata";
    var params = { tbname: "companylogo", listcid: listcom };
    var header = "";
    var jsondata = await this.va.WsData(wsname, params, header);
    if (jsondata.code == "000") {
      if (jsondata.data.length > 0) {
        jsondata.data.forEach((item: any) => {
          var comp = this.activedashboad.find(x => x.cid == item.id);
          if (comp) { comp.complogo = item.img; }
        });
      }
    }
  }
  showdiverwork(driver: any) {
    console.log("driver :", driver);
    var workdata = this.listdashboad.filter(x => x.docode == driver.docode);
    if (workdata && workdata.length > 0) {
      this.activedriver = workdata[0];
      this.activedriver.activitylog = [];
      workdata.forEach(item => {
        var act = new DriverActivity()
        act.setdata(item);
        this.activedriver.activitylog.push(act)
      });
    }
    console.log(" this.activedriver :", this.activedriver);
    this.show.Driverwork = true;
  }

  async updatestatus(activedriver: Dashboarddata, event: DriverActivity, transtatus: number) {
    console.log("updatestatus event", event);
    console.log("updatestatus transtatus", transtatus);
    try {
      var wsname = "updatedriverstatus"
      var param = {
        driverid: activedriver.driverid,
        drivername: activedriver.fullname,
        compid: activedriver.cid,
        company: activedriver.companyname,
        docode: activedriver.docode,
        doname: activedriver.doname,
        vlicent: activedriver.vlicent,
        statusname: activedriver.dstatusname,
        statusid: event.statusid,
        value: transtatus
      };

      // this.sendMQTT("gbd", JSON.stringify(param), this.mqttClient);
      var jsondata = await this.va.WsData(wsname, param, "");
      console.log("updateStatus jsondata :", jsondata);
      if (jsondata.code == "000") {
        // await this.ShowWorkCheckin();
        //Update status in list
        event.transtatus = transtatus;
        // if (event.statusid == 5) {
        //   if (transtatus == 0) {
        //     var index = this.activecomp.unwakeuplist.findIndex(x => x.docode == activedriver.docode);
        //     if (index) {
        //       this.activecomp.wakeuplist.push(this.activecomp.unwakeuplist[index]);
        //       this.activecomp.unwakeuplist.splice(index, 1);
        //     }
        //   }
        //   else {
        //     var index = this.activecomp.wakeuplist.findIndex(x => x.docode == activedriver.docode);
        //     if (index) {
        //       this.activecomp.unwakeuplist.push(this.activecomp.wakeuplist[index]);
        //       this.activecomp.wakeuplist.splice(index, 1);
        //     }
        //   }
        //   this.activecomp.totalwake = this.activecomp.wakeuplist.length;
        // }
        this.show.Driverwork = false;
        await this.getdashboarddata();
        var showcomp = this.activedashboad.find(x=>x.cid==this.activecomp.cid);
        if(showcomp){
          showcomp.showdetail = true;
          
        }
      }
      else {
        alert("Update Status Error :" + jsondata.message)
      }
    }
    catch (ex: any) {
      console.log("updateStatus error :", ex);
      alert("Update Status Error :" + ex.ToString())
    }
  }


  //--------------------- MQTT  Lissening------------------------
  mqttconfig = this.va.mqttconfig;
  async connectMqtt() {
    try {

      var mqttclient = await mqtt.connect(this.mqttconfig.url, {
        clientId: 'client_' + Math.floor(Math.random() * 10000),
        username: this.mqttconfig.username, password: this.mqttconfig.password
      });
      mqttclient.on('message', (receivedTopic: string, message: any) => {
        this.decodemqtt(receivedTopic, message);
      });
      return mqttclient;
    } catch (ex) { console.log("Error ========> ", ex); }
    return null;
  }
  async subscribeMqtt(mqttclient: MqttClient, topic: string) {
    try {
      if (mqttclient) {
        mqttclient.subscribe(topic, { qos: 0 }, (err: any) => {
          if (err) {
            console.log("err");
          } else {
            console.log("Subscribed");
          }
        });
      } else {
        console.log('MQTT client is not connected.');
      }
    } catch (ex) { console.log("Error ========> ", ex); }
  }
  //--------------------- MQTT  Send -----------------------
  async sendMQTT(topic: string, message: any, mqttclient: MqttClient) {
    try {
      if (!mqttclient || mqttclient.disconnected) {
        mqttclient = await mqtt.connect(this.mqttconfig.url, {
          clientId: 'client_' + Math.floor(Math.random() * 10000),
          username: this.mqttconfig.username, password: this.mqttconfig.password
        });
      }
      mqttclient.publish(topic, message);
      return true;
    }
    catch (ex) { console.log("sendMessage error : ", ex); }
    return false;
  }

  async decodemqtt(topic: string, message: string) {
    if (topic === "gbdupdate") {
      const msg = message.toString();
      var data = JSON.parse(msg);
      console.log("data: ", data);
      var mqttdriver = this.listdashboad.find(x => x.docode == data.docode && x.driverid == data.driverid && x.dstatus == data.statusid);
      console.log("mqttdriver: ", mqttdriver);
      if (mqttdriver) {
        this.updatedriverevent(mqttdriver, data);
        // mqttdriver.actvalue = data.value;
        // var comp = this.activedashboad.find(x => x.cid == data.compid)
        // console.log("comp 1: ", comp);

        // if (comp) {
        //   var compdo = comp.dolist.find(x => x.docode == data.docode);
        //   console.log("compdo: ", compdo);
        //   if (compdo) {
        //     var doact = compdo.listactivity.find(x => x.statusid == data.statusid);
        //     console.log("doact: ", doact);
        //     if (doact) {
        //       doact.transtatus = data.value;
        //     }
        //   }
        //   if (data.statusid == 5) {
        //     if (data.value == 0) {
        //       var index = comp.wakeuplist.findIndex(x => x.docode == data.docode && x.statusid == data.statusid)
        //       if (index) {
        //         comp.unwakeuplist.push(comp.wakeuplist[index]);
        //         comp.wakeuplist.splice(index, 1);
        //       }
        //     }
        //     else {
        //       var index = comp.unwakeuplist.findIndex(x => x.docode == data.docode && x.statusid == data.statusid)
        //       if (index) {
        //         comp.wakeuplist.push(comp.unwakeuplist[index]);
        //         comp.unwakeuplist.splice(index, 1);
        //       }
        //     }
        //     comp.totalwake = comp.wakeuplist.length;
        //   }
        //   console.log("comp2", comp);
        // }
      }
      else {
        // ใบงานใหม่ หรือ บริษัท ไม่อยู่ในรายการ
        var comp = this.activedashboad.find(x => x.cid == data.compid)
        if (comp) {
          // ใบงานใหม่ของบริษัทที่อยู่ในรายการแสดงข้อมูลของพนักงาน
          await this.getdashboarddata();
        }
      }
    }
    else if (topic === "gbvupdate") {

    }
  }

  updatedriverevent(mqttdriver: Dashboarddata, data: any) {
    mqttdriver.actvalue = data.value;
    var comp = this.activedashboad.find(x => x.cid == data.compid)
    console.log("comp 1: ", comp);

    if (comp) {
      var compdo = comp.dolist.find(x => x.docode == data.docode);
      console.log("compdo: ", compdo);
      if (compdo) {
        var doact = compdo.listactivity.find(x => x.statusid == data.statusid);
        console.log("doact: ", doact);
        if (doact) {
          doact.transtatus = data.value;
        }
      }
      if (data.statusid == 5) {
        if (data.value == 0) {
          var index = comp.wakeuplist.findIndex(x => x.docode == data.docode && x.statusid == data.statusid)
          if (index) {
            comp.unwakeuplist.push(comp.wakeuplist[index]);
            comp.wakeuplist.splice(index, 1);
          }
        }
        else {
          var index = comp.unwakeuplist.findIndex(x => x.docode == data.docode && x.statusid == data.statusid)
          if (index) {
            comp.wakeuplist.push(comp.unwakeuplist[index]);
            comp.unwakeuplist.splice(index, 1);
          }
        }
        comp.totalwake = comp.wakeuplist.length;
      }
      console.log("comp2", comp);
    }
  }

}


