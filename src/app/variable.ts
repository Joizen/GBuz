import { Injectable ,NgModule } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import * as CryptoJS from 'crypto-js';
import { DatePipe,CommonModule } from '@angular/common';
import liff from '@line/liff';
import { PagekeyModel } from '../app/models/datamodule.module';
import mqtt, { MqttClient } from 'mqtt';
import {ProfileModel} from './models/datamodule.module'
import { LOCALE_ID } from '@angular/core';


@Injectable({ providedIn: 'root' })

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [DatePipe, [{ provide: LOCALE_ID, useValue: 'th' }]],
})

export class variable {
  constructor(private http: HttpClient) { }

  
  // public wsUrl: string = "https://dashboardgbus.gpsasiagps.com/"; 
  public wsUrl: string = "http://localhost:9080/";

  public ProgramID = "EB26F64F4A40DC734C85AF89EADA1D10";
  public imagepath = "assets/images/";
  public liffId = "2005033993-ARK31Ewk";
  public linemMemurl = "https://line.me/R/ti/p/@491tyduv";

  // public mqttconfig = { url: 'wss://gbus.gpsasiagps.com:7902', username: "", password: "" }
  public mqttconfig = { url: 'ws://35.240.240.96:9001', username: "", password: "" }
  public showmenu = false;
  public icon = this.seticon();

  public calendarperiod=15;
  public defultdate = new Date('2000-01-01 00:00:00')

  // #region  =========== Encryption=========================
  public setpagekey(pagedata: any) {
    try {
      var keyname: string = this.ProgramID + "pagekey"
      var value: string = JSON.stringify(pagedata);
      localStorage.setItem(keyname, value);
    }
    catch (ex) { console.log("setpagekey ex", ex); }
  }

  public getpagekey() {
    try {
      var keyname: string = this.ProgramID + "pagekey"
      var value = localStorage.getItem(keyname);
      // console.log("getpagekey pagekey", value);
      if (value) {
        var result = JSON.parse(value);
        // console.log("getpagekey result", result);
        // return new PagekeyModel(result.cid,result.apistime);  
      }
      return new PagekeyModel("", "");
    }
    catch (ex) {
      console.log("getpagekey ex", ex);
      return new PagekeyModel("", "");
    }
  }

  public removepagekey() {
    var keyname: string = this.ProgramID + "pagekey"
    localStorage.removeItem(keyname);
  }

  public async getpageid() {
    try {
      this.removepagekey();
      var result = await this.getwsnouserdata("getpageid", {}, this.ProgramID);
      console.log("getpageid result :", result);
      if (result != undefined) {
        this.setpagekey({ cid: result.cid, apistime: result.apistime });
        console.log("getpageid result 2 :", result);
        return "Get Paget ID Success";
        // console.log("getpageid Pagekey :",this.getpagekey());
      } else {
        console.log("Start Register error getpageid : undefined");
        return "Get Paget ID Error : getpageid was undefined";
        // alert("Start Register error");
      }
    } catch (ex) {
      console.log("getpageid error : ", ex);
      return "Get Paget ID Error : " + ex;
      // alert("Start Register error");
    }
  }

  public async getprofile() {
    var result : ProfileModel| undefined;
    try {
      var keyname: string = this.ProgramID + "-Profile"
      var value = localStorage.getItem(keyname);
      // console.log("getprofile profile : ", value);
      if (value) {
        var strvalue  = JSON.parse(value);
        result = new ProfileModel();
        result.setData(strvalue);
        return result;
      }
    }
    catch (ex) {
      console.log("getpagekey ex", ex);
    }
    return result;
  }
  
  public async setprofile(profile:any) {
    try {
      var keyname: string = this.ProgramID + "-Profile"
      var value = JSON.stringify(profile);
      localStorage.setItem(keyname,value);
      return true;
    }
    catch (ex) {
      console.log("getpagekey ex", ex);
    }
    return false;
  }

  public async getprofiledata() {
    try {
      var wsname= "getdata"
      var result = await this.getwsdata(wsname, {tbname:"adminprofile",isone:true}, );
      console.log("getprofiledata result : ", result);
      if (result.code=="000" && result.data!= null) {
        this.setprofile(result.data);
        return true;
      } 
    } catch (ex) {
      console.log("getprofiledata error : ", ex);
    }
    return false;
  }
  
  public setlogin(jsondata: any) { 
    console.log("setlogin data :",jsondata) 
    localStorage.setItem( (this.ProgramID +"-token"), jsondata.data.token); 
    localStorage.setItem((this.ProgramID +"-uid"), jsondata.member); 
  }

  public getmember() {
    var item = localStorage.getItem(this.ProgramID +"-uid");
    return (item) ? item : "";
  }



  public settoken(token: string) { localStorage.setItem((this.ProgramID +"-token"), token); }

  public gettoken() {
    var item = localStorage.getItem(this.ProgramID +"-token");
    return (item) ? item : "";
  }
  encrypjson(data: any, key: string) {
    try {
      var str = JSON.stringify(data);
      // var key = this.getPageID();       
      if (key != "") {
        // var result = CryptoJS.AES.encrypt(str, key).toString();
        // console.log("encrypjson key : ",result);
        // return result;
        return null;
      } else {
        return "";
      }
    } catch (ex) {
      console.log("encrypjson Error : ", ex);
      return "";
    }
  }

  decrypjson(data: string, key: string) {
    // if(key==""){key =  this.getPageID();} 
    // var bytes = CryptoJS.AES.decrypt(data, key);
    // return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return null;
  }
   // #endregion

 // #region =========== driver & Vehicle status =========================
  public getstatuscolor(id:number){
    if(id==5){return "#efbbfc";} //ชมพู
    else if(id==10){return "#f6f8c4";} //เหลือง
    else if(id==15){return "#f6f8c4";} //เหลือง
    else if(id==20){return "#bbfcfb";} //ฟ้า
    else if(id==25){return "#cef8ba";} //เขียว
    else if(id==30){return "#e5e1e2";} //เทา
    else{return "#FFFFFF";} //สีขาว
  }
  public getstatusname(id:number){
    if(id==5){return "Wakeup";} //ชมพู
    else if(id==10){return "Alcohol";} //เหลือง
    else if(id==15){return "Temperature";} //เหลือง
    else if(id==20){return "Engine start";} //ฟ้า
    else if(id==25){return "On the way";} //เขียว
    else if(id==30){return "Finish";} //เทา
    else{return "Not available ";} //สีขาว
  }
  public getvcolor(id:number){
    if(id==30){return "#03af15";} //เขียว
    else if(id==31){return "#fab704";} //เหลือง
    else if(id==33){return "#fa0404";} //แดง
    else if(id==41){return "#6803bd";} //ม่วง
    else if(id==80){return "#949494";} //เทา
    else if(id==60||id==61||id==62){return "#1830fa";} //เทาอ่อน
    else{return "#d6d4d4";} //949494
  }
  public getvstatusname(id:number){
    if(id==30){return "กำลังเดินทาง";} //เขียว
    else if(id==31){return "หยุดรถ (ไม่ดับเครื่อง)";} //เหลือง
    else if(id==33){return "จอดรถ (ดับเครื่อง)";} //แดง
    else if(id==41){return "ความเร็วเกินกำหนด";} //ม่วง
    else if(id==80){return "ไม่พบ GPS";} //เทา
    else if(id==60||id==61||id==62){return "ไฟไม่เข้ากล่อง";} //เทาอ่อน
    else{return "ไม่ทราบสถานะ";} //949494
  }
  public seticon(){
    return{
      user:this.imagepath + "user.png",
      poi: this.imagepath + "poi.png",
      dpoi: this.imagepath + "dp.png",
      logo : this.imagepath + "logo.png",
      nologo : this.imagepath + "nologo.png",
      thispoint : this.imagepath + "thispoint.png",
    }
  }
  public getactiveicon(id:any){
    if(id==5){return "check_circle";}
    else if(id==10){return "record_voice_over";}
    else if(id==15){return "hot_tub";}
    else if(id==20){return "power_settings_new";}
    else if(id==25){return "local_shipping";}
    else if(id==30){return "flag";}
    else {return "report";}
  }
  public getdaycolor(date:Date){
    const days = ['#ff6161','#faeca0', '#ffb5fd', '#b1f0bd', '#ffd28a', '#90e5fc', '#cda7db'];
    return days[date.getDay()];
  }
  public getdayname(date:Date){
    var days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"]
    return days[date.getDay()];
  }
  public getselecttime(period:number,startdate = new Date(2000,1,1)){
    var datePipe: DatePipe = new DatePipe('en-US');
    var result: any =[];
    var cdate = new Date(startdate);
    cdate.setHours(0, 0, 0, 0);
    var totaldata = Math.floor(1440/period);
    var tdate=new Date(cdate);
    for(var i =0; i< totaldata;i++){
      var time = datePipe.transform(tdate, 'HH:mm') || '00:00';
      result.push({id:i,selecttime:tdate,displaytime:time}) ;
      tdate.setMinutes(tdate.getMinutes()+period);
    }
    return result;
  }
  public setphoneformat(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    const match = cleanPhone.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  }
   // #endregion

  // #region =========== APIs & Webservice =========================

  async getwsnouserdata(wsname: string, params: any, header: any): Promise<any> {
    var response;
    try {
      wsname = this.wsUrl + wsname;
      var pagekey = this.getpagekey();
      var tokenitem = header;
      if (pagekey) { tokenitem = this.encrypjson(header, pagekey.cid); }
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + tokenitem
      });

      var encripdata = params;
      if (pagekey) { encripdata = this.encrypjson(params, pagekey.cid); }
      var apistime = "2000-01-01 00:00:00";
      if (pagekey) { apistime = pagekey.apistime; }
      var payload = { param: encripdata, apistime: apistime }
      // console.log("getwsnouserdata wsname : ", wsname);
      // console.log("getwsnouserdata payload : ", payload);
      // console.log("getwsnouserdata headers : ", headers);
      response = await this.http.post<any>(wsname, payload, { headers }).toPromise();
      // console.log("getwsnouserdata "+wsname+" response ", response);
    } catch (ex) {
      response = { code: "-1", msg: ex };
    }
    return response;
  }
// get APIs with token
  // async getwsdata(wsname: string, params: any): Promise<any> {
  //   var response;
  //   try {
  //     wsname = this.wsUrl + wsname;
  //     var tokenitem = localStorage.getItem("token"); 
  //     if (tokenitem) {
  //       const headers = new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ` + tokenitem
  //       });
  //       response = await this.http.post<any>(wsname, params, { headers }).toPromise();
  //       return(response);
  //     }
  //     else {
  //       response = { code: "-3", message: "no user token", data: null };
  //     }

  //   } catch (ex) {
  //     response = { code: "-1", msg: ex };
  //   }
  //   return response;
  // }

// get APIs with out token
  async getwsdata(wsname: string, params: any): Promise<any> {
    try {
      wsname = this.wsUrl +"_"+ wsname;
      var tokenitem = "";
      params.uid = this.getmember();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + tokenitem});
        // console.log ("wsname ",wsname);
        // console.log ("params ",params);  
        var response = await this.http.post<any>(wsname, params, { headers }).toPromise();
        return(response);
      }
    catch (ex) {
      return { code: "-1", msg: ex };
    }
  }

  async wsdata(wsname: string, params: any, header: string): Promise<any> {
    var response;
    try {
      wsname = this.wsUrl + wsname;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + header
      });
      var payload = params;
      // if(!payload.uid){payload.uid=1;}
      // console.log("payload", payload);

      response = await this.http.post<any>(wsname, payload, { headers }).toPromise();
      // console.log("wsdata " + wsname + " response ", response);
      return response;
    } catch (ex) {
      response = { code: "-1", msg: ex };
      // console.log("wsdata error " , ex);
    }
    return response;
  }

  async getadmin(lat:number,lng:number){
    try{
      var wsname = 'getdata';
      var params = { tbname: 'adminlocation', lat: lat,lng:lng ,isone:true};
      var jsondata = await this.getwsdata(wsname, params);
      if (jsondata.code == '000') { return jsondata.data}
    }
    catch(ex){console.log("getadmin error :", ex);}
    return undefined;
  }

  //#endregion
  
  // #region =========== Line Profile =========================
  async getlineprofile() {
    try {
      await liff.init({ liffId: this.liffId });
      if (!liff.isLoggedIn()) {
        liff.login();
      }
      else {
        return await liff.getProfile();
      }
    } catch (ex) {
      console.log("Get Line Profile Error :", ex)
    }
    return null;
  }
  // #endregion
  
  // #region  =========== MQTT =========================
 //--------------------- MQTT  Lissening------------------------

  public async sendmqtt(topic: string, message: any) {
   var mqttclient:MqttClient|undefined;
   try {
       mqttclient = await mqtt.connect(this.mqttconfig.url, {
       clientId: 'client_' + Math.floor(Math.random() * 10000),
       username: this.mqttconfig.username,
       password: this.mqttconfig.password,
       });
       mqttclient.publish(topic, message);
     return true;
   } catch (ex) {
     console.log('sendMessage error : ', ex);
   }
   return false;
 }
  // #endregion


 // #region =========== Date Time =========================
  public DateToString(format: string, date = new Date()) {
    var datePipe: DatePipe = new DatePipe('th');
    var result = datePipe.transform(date, format);
    if (result != null) {
      return result;
    }
    else {
      if (format == 'HH:mm') { return "00:00"; }
      else if (format == 'HH:mm:ss') { return "00:00:00"; }
      else { return date.toLocaleDateString(); }

    }
  }
  public getperiodinminutes(startDate: Date, endDate: Date): number {
    const oneMinute = 60 * 1000; // Milliseconds in one minute
    const diffInTime = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
    return Math.abs( Math.floor(diffInTime / oneMinute)); // Convert to minutes
  }
  public getperiodid(time:Date){
    // console.log("time :",time);
    // const mytime = new Date(time);
    // const result = { edate: new Date("2024-10-14T14:30:00") }; // กำหนดวันที่และเวลาที่แน่นอน
    const totalMinutes = (time.getHours() * 60) + time.getMinutes();
    return Math.floor(totalMinutes / this.calendarperiod);
    
  }
  public isNotDefaultDate(date: Date | string): boolean {
    return new Date(date).getTime() !== this.defultdate.getTime();
  }
  public getdistance(fromlat:number,fromlng:number,tolat:number,tolng:number){
    const R = 6371; // รัศมีของโลกในหน่วยกิโลเมตร
    const dLat = (tolat - fromlat) * Math.PI / 180;
    const dLon = (tolng - fromlng) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(fromlat * Math.PI / 180) * Math.cos(tolat * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = (R * c)*1000; // ระยะทางในหน่วยเมตร
    return distance;
  }
// #endregion
}
 // #region =========== get Function by class =========================
export function DateToString(date = new Date(),format: string): string {
  var datePipe: DatePipe = new DatePipe('th');
  var result = datePipe.transform(date, format);
  if (result != null) {
    return result;
  }
  else {
    if (format == 'HH:mm') { return "00:00"; }
    else if (format == 'HH:mm:ss') { return "00:00:00"; }
    else { return date.toLocaleDateString(); }
  }
}
export function  getdaycolor(date:Date):string {
  const days = ['#ff6161','#faeca0', '#ffb5fd', '#b1f0bd', '#ffd28a', '#90e5fc', '#cda7db'];
  return days[date.getDay()];
}
export function getdayname(date:Date):string {
  var days = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"]
  return days[date.getDay()];
}
export function getactiveicon(id:number):string{
  if(id==5){return "check_circle";}
  else if(id==10){return "record_voice_over";}
  else if(id==15){return "hot_tub";}
  else if(id==20){return "power_settings_new";}
  else if(id==25){return "local_shipping";}
  else if(id==30){return "flag";}
  else {return "report";}
}
export function  getstatusname(id:number):string{
  if(id==5){return "Wakeup";} //ชมพู
  else if(id==10){return "Alcohol";} //เหลือง
  else if(id==15){return "Temperature";} //เหลือง
  else if(id==20){return "Engine start";} //ฟ้า
  else if(id==25){return "On the way";} //เขียว
  else if(id==30){return "Finish";} //เทา
  else{return "Not available ";} //สีขาว
}

// #endregion
