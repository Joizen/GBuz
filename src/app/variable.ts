import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import * as CryptoJS from 'crypto-js';
import { DatePipe } from '@angular/common';
import liff from '@line/liff';
import { PagekeyModel } from '../app/models/datamodule.module';


@Injectable({ providedIn: 'root' })
export class variable {
  constructor(private http: HttpClient, private datePipe: DatePipe) { }
  
  // public wsUrl: string = "https://dashboardgbus.gpsasiagps.com/"; 
  public wsUrl: string = "http://localhost:9080/";

  public ProgramID = "EB26F64F4A40DC734C85AF89EADA1D10";
  public imagepath = "assets/images/";
  public liffId = "2005033993-ARK31Ewk";
  public linemMemurl = "https://line.me/R/ti/p/@491tyduv";

  public mqttconfig = { url: 'wss://gbus.gpsasiagps.com:7902', username: "", password: "" }
  // public mqttconfig = { url: 'ws://35.240.240.96:9001', username: "", password: "" }
 

  public icon = this.Seticon();


  // =========== Encryption=========================
  public setPagekey(pagedata: any) {
    try {
      var keyname: string = this.ProgramID + "pagekey"
      var value: string = JSON.stringify(pagedata);
      localStorage.setItem(keyname, value);
    }
    catch (ex) { console.log("setPagekey ex", ex); }
  }
  public getPagekey() {
    try {
      var keyname: string = this.ProgramID + "pagekey"
      var value = localStorage.getItem(keyname);
      console.log("getPagekey pagekey", value);
      if (value) {
        var result = JSON.parse(value);
        console.log("getPagekey result", result);
        // return new PagekeyModel(result.cid,result.apistime);  
      }
      return new PagekeyModel("", "");
    }
    catch (ex) {
      console.log("getPagekey ex", ex);
      return new PagekeyModel("", "");
    }
  }

  public removePagekey() {
    var keyname: string = this.ProgramID + "pagekey"
    localStorage.removeItem(keyname);
  }

  public async getpageid() {
    try {
      this.removePagekey();
      // var pagekey = this.getPagekey();
      // console.log("getpageid Pagekey :",pagekey);
      // if(!pagekey||pagekey.cid==""){
      var result = await this.getWsnoUserData("getpageid", {}, this.ProgramID);
      console.log("getpageid result :", result);
      if (result != undefined) {
        this.setPagekey({ cid: result.cid, apistime: result.apistime });
        console.log("getpageid result 2 :", result);
        return "Get Paget ID Success";
        // console.log("getpageid Pagekey :",this.getPagekey());
      } else {
        console.log("Start Register error getpageid : undefined");
        return "Get Paget ID Error : getpageid was undefined";
        // alert("Start Register error");
      }
      // }
      // else{

      // }
    } catch (ex) {
      console.log("getpageid error : ", ex);
      return "Get Paget ID Error : " + ex;
      // alert("Start Register error");
    }
  }

  public setToken(token: string) { localStorage.setItem("token", token); }

  public getToken() {
    var item = localStorage.getItem("token");
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

  Seticon(){
    return{
      user:this.imagepath + "user-ic.png",
      poi: this.imagepath + "poi.png",
      dpoi: this.imagepath + "dp.png",
      logo : this.imagepath + "logo.png",
      nologo : this.imagepath + "nologo.png",
      thispoint : this.imagepath + "thispoint.png",
    }
  }
  public getactiveicon(id:number){
    if(id==5){return "check_circle";}
    else if(id==10){return "record_voice_over";}
    else if(id==15){return "hot_tub";}
    else if(id==20){return "power_settings_new";}
    else if(id==25){return "local_shipping";}
    else if(id==30){return "flag";}
    else {return "report";}
  }

 // =========== driver & Vehicle status =========================
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
  // =========== APIs & Webservice =========================

  async getWsnoUserData(wsname: string, params: any, header: any): Promise<any> {
    var response;
    try {
      wsname = this.wsUrl + wsname;
      var pagekey = this.getPagekey();
      // console.log("getWsnoUserData pagekey ", pagekey);
      var tokenitem = header;
      if (pagekey) { tokenitem = this.encrypjson(header, pagekey.cid); }
      // console.log("getWsnoUserData tokenitem ", tokenitem);
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + tokenitem
      });

      // console.log("getWsnoUserData params ", params);
      var encripdata = params;
      if (pagekey) { encripdata = this.encrypjson(params, pagekey.cid); }
      // console.log("getWsnoUserData encripdata ", encripdata);
      var apistime = "2000-01-01 00:00:00";
      if (pagekey) { apistime = pagekey.apistime; }
      var payload = { param: encripdata, apistime: apistime }

      // console.log("getWsData headers ", headers);
      console.log("getWsnoUserData wsname : ", wsname);
      console.log("getWsnoUserData payload : ", payload);
      console.log("getWsnoUserData headers : ", headers);
      response = await this.http.post<any>(wsname, payload, { headers }).toPromise();
      // console.log("getWsData "+wsname+" response ", response);
    } catch (ex) {
      response = { code: "-1", msg: ex };
    }
    return response;
  }

  async getWsData(wsname: string, params: any): Promise<any> {
    var response;
    try {
      wsname = this.wsUrl + wsname;
      var tokenitem = localStorage.getItem("token");
      if (tokenitem) {
        console.log("getWsData tokenitem ", tokenitem);
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ` + tokenitem
        });
        // console.log("getWsData params ", params);
        var pagekey = this.getPagekey();
        var encripdata = this.encrypjson(params, pagekey.cid);
        var payload = { param: encripdata, apistime: pagekey.apistime }

        console.log("getWsnoUserData wsname : ", wsname);
        console.log("getWsnoUserData payload : ", payload);
        console.log("getWsnoUserData headers : ", headers);
        response = await this.http.post<any>(wsname, payload, { headers }).toPromise();
        console.log("getWsData " + wsname + " response ", response);
        if (response.code == "000") {
          var decripdata = this.decrypjson(response.encrypdata, pagekey.cid);
          // console.log("getWsData decripdata.apistime ", decripdata.apistime);
          // console.log("getWsData ecripdata.cid ", decripdata.cid);
          // var cid =decripdata.cid;
          // var apistime =decripdata.apistime;
          // this.setPagekey ({cid:cid,apistime:apistime});
          console.log("getWsData new pagekey ", this.getPagekey());


          // delete decripdata.cid;
          // delete decripdata.apistime;
          response.data = decripdata;
        }
        else {
          // this.removePagekey();
          this.getpageid();
        }
      }
      else {
        response = { code: "-3", message: "no user token", data: null };
      }

    } catch (ex) {
      response = { code: "-1", msg: ex };
    }
    return response;
  }

  async WsData(wsname: string, params: any, header: string): Promise<any> {
    var response;
    try {
      wsname = this.wsUrl + wsname;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + header
      });
      var payload = params;
      console.log("payload", payload);

      response = await this.http.post<any>(wsname, payload, { headers }).toPromise();
      console.log("WsData " + wsname + " response ", response);
      return response;
    } catch (ex) {
      response = { code: "-1", msg: ex };
    }
    return response;
  }

  async getWebservice(url: string, param: any) {
    var response;
    try {
      response = await this.http.post<any>(this.wsUrl + url, param).toPromise();
    } catch (ex) {
      console.log("ws err", ex);
      response = { code: "-3", msg: ex };
    }
    return response;
  }

  // =========== Line Profile =========================
  async getLineProfile() {
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
  // =========== Date Time =========================
  public DateToString(format: string, date = new Date()) {
    var result = this.datePipe.transform(date, format);
    if (result != null) {
      return result;
    }
    else {
      if (format == 'HH:mm') { return "00:00"; }
      else if (format == 'HH:mm:ss') { return "00:00:00"; }
      else { return date.toLocaleDateString(); }

    }
  }



}

