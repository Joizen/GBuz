import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { variable } from './variable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public va: variable,private router: Router) {}
  menuopen=false;
  // showmenu=true;
  title = 'Smart Control';  
  timeLeft: number = 5;  // Refresh token after timeLeft (300) seconds
  interval: any;
  colck:Date = new Date;
  resetcounter = 60;

  async ngOnInit() {

 }

  openPage(pagename:string){
    this.router.navigate([pagename]);
    this.menuopen=false;
    // this.showmenu= (pagename !="login");    
  }

  startTimer() {
    if (!this.interval) {
      this.interval = setInterval(async () => {
        this.colck = new Date ;
        // console.log("this.UserProfile : ",this.UserProfile);
        if(!this.va.UserProfile){
          this.va.UserProfile = await this.va.getprofile();
          //  console.log("this.UserProfile 2 : ",this.UserProfile);
        }
        if(this.timeLeft<=0){
          if(await this.refreshtoken()){       
            this.timeLeft=300; // Refresh token after timeLeft (300) seconds
            this.resetcounter=60;
          }else{
            this.resetcounter-=1
            if(this.resetcounter<=0){
              this.va.settoken("");
              this.router.navigate(["login"]);
            }
          }
        }
        else{this.timeLeft-=1}
        // this.showmenu= (this.va.gettoken()!="")
      }, 1000);
    }
  }

  async refreshtoken(){
    try{
      if(this.va.gettoken()==""){return false;}
      var  wsname = "refreshtoken";
      var jsondata = await this.va.getwsdata(wsname,{})
      if(jsondata.code=="000"){
        // console.log("refreshtoken jsondata : ",jsondata);     
        if(jsondata.token!=undefined){
          this.va.settoken(jsondata.token);
          return true;
        }
      }
    }catch(ex){console.log("Checklogin Error : ",ex)}
    return false;
  }




}
