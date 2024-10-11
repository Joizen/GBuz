import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as crypto from 'crypto-js';  // Import crypto-js for MD5 hashing
import{ variable } from '../../variable'
import { DialogpageComponent, DialogConfig } from '../../material/dialogpage/dialogpage.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import mqtt, { MqttClient } from 'mqtt';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {
  constructor(private router: Router,public va:variable,private dialog: MatDialog, private snacbar: MatSnackBar) {}
  public login = {user:"bwon.t",pwd:"123456",encpwd:""}
  public passwordVisible = false; 

  ngOnInit(): void {
    this.va.settoken("");
  }

  async onLoginClkick(){
   if(this.login.user.trim()!=""&&this.login.pwd.trim()!=""){
    if(await this.Checklogin()){
      // login success
      if(await this.va.getprofiledata()){
        this.router.navigate(["maindashboard"]);
        // var token =this.va.gettoken();
        // this.va.sendmqtt("gbdashboard",token)
        }
      else{
        this.alertMessage("get Profile Failed","Please try again");
      }
    }
   }else{
    this.alertMessage("Login Failed","Please filing login and password");
   }
  }
  
  async Checklogin(){
    try{
      this.login.encpwd = crypto.MD5(this.login.pwd).toString().toLocaleUpperCase();
      var  wsname = "checklogin";
      var param ={login:this.login.user,pwd:this.login.encpwd};
      var header ="";
      var jsondata = await this.va.wsdata(wsname,param,header)
      console.log("onLogin jsondata : ", jsondata);
      if(jsondata.code=="000"){
        this.showSanckbar("Login success",2);
        if(jsondata.data.token!=undefined){
          this.va.settoken(jsondata.data.token);
          return true;
        }
      }
      else{
        this.alertMessage("Login Failed",jsondata.message);
      }
  
    }catch(ex){console.log("Checklogin Error : ",ex)}
    return false;
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
      // dialogRef.afterClosed().subscribe(result => {
      //   return result;
      // });
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
