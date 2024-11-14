import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { variable } from './variable';
import mqtt, { MqttClient } from 'mqtt';
import { ProfileModel} from './models/datamodule.module';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public va: variable,private router: Router) {}
  menuopen=false;
  showmenu=true;
  title = 'Smart Control';  
  timeLeft: number = 5;  // Refresh token after timeLeft (300) seconds
  interval: any;
  colck:Date = new Date;
  resetcounter = 60;

  public mqttClient: any;
  public mqttconfig = this.va.mqttconfig;
  public UserProfile:ProfileModel|undefined;

  async ngOnInit() {
    this.mqttClient = await this.connectMqtt();
    this.subscribeMqtt(this.mqttClient, 'gbdashboard');
    // console.log('subscribeMqtt gbdashboard : ',this.mqttClient);
    // this.startTimer();
 }

  openPage(pagename:string){
    this.router.navigate([pagename]);
    this.menuopen=false;
    this.showmenu= (pagename !="login");    
  }

  startTimer() {
    if (!this.interval) {
      this.interval = setInterval(async () => {
        this.colck = new Date ;
        // console.log("this.UserProfile : ",this.UserProfile);
        if(!this.UserProfile){
          this.UserProfile = await this.va.getprofile();
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
        this.showmenu= (this.va.gettoken()!="")
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

     //--------------------- MQTT  Lissening------------------------

     async connectMqtt() {
       try {
         var mqttclient = await mqtt.connect(this.mqttconfig.url, {
           clientId: 'client_' + Math.floor(Math.random() * 10000),
           username: this.mqttconfig.username,
           password: this.mqttconfig.password,
         });
         mqttclient.on('message', (receivedTopic: string, message: any) => {
            // console.log('New Message> ', message);
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
              // console.log('Subscribed',topic);
            }
          });
        } else {
          console.log('MQTT client is not connected.');
        }
      } catch (ex) {
        console.log('Error ========> ', ex);
      }
     }

     async decodemqtt(topic: string, message: string) {
      if (topic === 'gbdashboard') {
        const msg = message.toString();
        // var data = JSON.parse(msg);
        // console.log('decodemqtt data: ', msg);
        var token =this.va.gettoken();
        // console.log('decodemqtt token: ', token);
        if(msg==token){
          this.UserProfile = await this.va.getprofile();
          this.showmenu=true;
        }
      } 
    }



}
