import { Component, Input,EventEmitter, Output, OnInit  } from '@angular/core';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dashboarddata, data, DoActivity, DoData} from '../../../models/datamodule.module';
import { variable } from '../../../variable';
import * as L from 'leaflet';

@Component({
  selector: 'app-driverdetailpage',
  templateUrl: './driverdetailpage.component.html',
  styleUrls: ['./driverdetailpage.component.scss']
})

export class DriverdetailpageComponent  implements OnInit{
  constructor(private modalService: NgbModal, config: NgbModalConfig ,public va: variable,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  @Input() modal: any;
  @Input() activedriver : DoData = new DoData();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  private drivermap: L.Map | undefined;
  private mapIconSize = 30;
  private vmarker :L.Marker|undefined;
  public locationname = "ไม่มีข้อมูล พิกัด GPS"
  ngOnInit(): void {
  //  ===================test ============
    // this.activedriver=this.gettestdata()
  //  ===================test ============

  console.log("activedriver : ",this.activedriver); 
   this.initMap()
  }
     //--------------------- Leaflet  Map------------------------
    private initMap(): void {
      // console.log("initMap this.map : ",this.drivermap);
      try{
        this.drivermap = L.map('drivermap', {
          center: [13.6140328, 100.6162229], // Latitude and longitude of the center point
          zoom: 13, // Initial zoom level
          layers: [
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap',
            }),
          ],
        });
        this.vmarker = this.plotMarker();
        }catch(ex){ console.log("initMap error : ",ex);}
    }

    private plotMarker(){
      var lat = this.activedriver.vlat;
      var lng = this.activedriver.vlng;
      var header = this.activedriver.fullname;
      var description = this.activedriver.doname;
      var image = this.activedriver.lineimage;
      if(lat!=0&&lng!=0){
        this.locationname = lat.toString()+", "+lng.toString()
        if(this.drivermap){      
          const customIcon = L.divIcon({
            html:`<div style="position: relative; width:${this.mapIconSize}px; height:${(this.mapIconSize*2)}px; display: flex;">'+
                    <img src="${this.va.icon.poi}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />'+
                    <img src="${image}" style="position: absolute; top: 5%; left: 10%; width: 80%; height: 40%;  border-radius: 50%; z-index: 2; opacity: 1.0;" />' +
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
          const marker =L.marker([lat,lng],{ icon: customIcon }).addTo(this.drivermap)
          .bindPopup(htmlPopup);
    
          marker.on('popupopen', function() {
            setTimeout(() => {marker.closePopup(); }, 3000); // 3000ms = 3 seconds
          });
          const resizeMarkerIcon = () => {
            const zoomLevel = this.drivermap?.getZoom();
            
            // Calculate new size based on zoom level (adjust the scaling factor as needed)
            const zl = zoomLevel?zoomLevel:13;
            const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level

            // Update the marker icon size
            marker.setIcon(
              L.divIcon({
                html:`<div style="position: relative; width:${newSize}px; height:${(newSize*2)}px; display: flex;">
                        <img src="${this.va.icon.poi}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
                        <img src="${image}" style="position: absolute; top: 5%; left: 10%; width: 80%; height: 40%;  border-radius: 50%; z-index: 2; opacity: 1.0;" />
                      </div>`,
                className: '', // Remove default styling
                iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
              })
            );
          };
          
          this.drivermap.on('zoom', resizeMarkerIcon);
          this.drivermap.panTo([lat,lng]);
          return marker;
        }

      }
      return undefined;
     }
    
    setcurrentposition(){
      if(this.activedriver.vlat!=0&&this.activedriver.vlng!=0){
        this.drivermap?.panTo([this.activedriver.vlat,this.activedriver.vlng]);
      }
    }

  async Changestatus(transtatus:number,value:number){
      // console.log("updatestatus this.activedriver", this.activedriver);
      try {
        var wsname = "updatedriverstatus"
        var param = {
          driverid: this.activedriver.driverid,
          drivername: this.activedriver.fullname,
          compid: this.activedriver.cid,
          company: this.activedriver.companyname,
          docode: this.activedriver.docode,
          doname: this.activedriver.doname,
          vlicent: this.activedriver.vlicent,
          statusname: this.va.getstatusname(transtatus),
          statusid: transtatus,
          value: value
        };
        var jsondata = await this.va.getwsdata(wsname, param);
        // console.log("updateStatus jsondata :", jsondata);
        if (jsondata.code == "000") {
          this.talk.emit({do:this.activedriver,transtatus:value} );
          this.modal.close();
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

  gettestdata(){
    var result= new DoData
      result.cid= 7;
      result.companyname= "Siam NDK";
      result.driverid= 135;
      result.fullname= "นาย สมภพ คำนั้น";
      result.phone= "0861428005";
      result.mobile= "086-1428005";
      result.linename= "GPS joice (PRG) ??";
      result.lineimage= "https://profile.line-scdn.net/0hrGvE0YfILWhbPD2ns9hTFytsLgJ4TXR6JVtlDG00dwsyBW1pIlJnCjw6J1plW2o2JFpjW2c6JwxXL1oORWrRXFwMcFlnCGs8dVJqjA";
      result.docode= "202208312-27-21-1";
      result.workday= "20220831";
      result.doname= "รับพนักงาน สายมาลัยทอง-บ้านสวน-รร.จั่น-NDK 19:15 คันที่ 1";
      result.routename= "สายมาลัยทอง-บ้านสวน-รร.จั่น-NDK";
      result.issend= 0;
      result.isendname= "ส่งพนักงานเข้าบริษัท";
      result.ot= 0;
      result.otname= "ปกติ";
      result.shifid= 27;
      result.shift= "กะเย็น";
      result.vid= 126;
      result.serialbox= "NOGPS126";
      result.vname= "NDK-34";
      result.vlicent= "นจ-384 ชลบุรี";
      result.vlat= 0;
      result.vlng= 0;
      result.vstatus= 0;
      result.vstatuscorlor= "#d6d4d4";
      result.vstatusname= "";
      result.vlocation= "";
      result.vlocationcode= "";
      result.vspeed= 0;
      result.vheader= 0;
      result.vio= "";
      result.startpoint= "";
      result.startpointname= "";
      result.starttext= "";
      result.starttime= "2022-08-31 19:15:00";
      result.finishtext= "20:00";
      result.finishtime= "2022-08-31 20:00:00";
      result.listdp= "669,670,671,672,673,674,675,676,677,678,679,680,681,682,370";
      result.listperiod= "0,1,0,0,0,0,0,0,0,0,0,0,0,0,0";
      result.listdpemp= "2,2,3,3,3,2,2,2,2,1,0,0,3,3,3,1,1,0,0,0,3,3,3,0";
      result.listemp= "541,690,190,391,822,133,390,94,259,523,0,0,202,238,588,474,444,0,0,0,181,188,907,0";
      result.liststatus= "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
      result.totalemp= 0;
      result.wakeup= 0;
      result.alc= 0;
      result.temp= 0;
      result.start= 0;
      result.otw= 0;
      result.finish= 0;
      result.wakeupshowtime= "";
      result.alcshowtime= "";
      result.tempshowtime= "";
      result.startshowtime= "";
      result.otwshowtime= "";
      result.finishshowtime= "";
      result.statuscorlor= "#FFFFFF";
      result.laststatus= 0;
      result.nextwarn= "";
      result.nextwarntime= "2000-01-01 00:00:00";
      result.nexttaget= "";
      result.nextstatus= 5;
      result.nextstatusname= "";
      result.nexttagettime= "2000-01-01 00:00:00";
      result.nextlat= 0;
      result.nextlng= 0;
      result.nexticon= "";
      result.listactivity= [],
      result.complogo= "data:image/png;base64,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";
      var w = new DoActivity()
        w.cid= 7;
        w.driverid= 135;
        w.docode= "202208312-27-21-1";
        w.lineimage= "";
        w.statusid= 5;
        w.statusname= "Wakeup";
        w.statuswarn= "2022-08-31T10:15:00.000Z";
        w.statustaget= "2022-08-31T11:15:00.000Z";
        w.statustime=  new Date("2024-09-11T05:08:46.000Z");
        w.showtime= "";
        w.statuslevel= 0;
        w.lat= 0;
        w.lng= 0;
        w.icon= "check_circle";
        w.transtatus= 0;
      result.listactivity.push(w);
      var a = new DoActivity()
        a.cid= 7;
        a.driverid= 135;
        a.docode= "202208312-27-21-1";
        a.lineimage= "";
        a.statusid= 10;
        a.statusname= "Alcohol";
        a.statuswarn= "2022-08-31T10:15:00.000Z";
        a.statustaget= "2022-08-31T11:15:00.000Z";
        a.statustime= new Date("2024-09-11T05:08:43.000Z");
        a.showtime= "";
        a.statuslevel= 0;
        a.lat= 0;
        a.lng= 0;
        a.icon= "record_voice_over";
        a.transtatus= 0;
      result.listactivity.push(a);
      var t = new DoActivity()
        t.cid= 7,
        t.driverid= 135,
        t.docode= "202208312-27-21-1",
        t.lineimage= "",
        t.statusid= 15;
        t.statusname= "Temperature";
        t.statuswarn= "2022-08-31T10:15:00.000Z";
        t.statustaget= "2022-08-31T11:15:00.000Z";
        t.statustime= new Date("2022-08-31T11:29:00.000Z");
        t.showtime= "";
        t.statuslevel= 0;
        t.lat= 0;
        t.lng= 0;
        t.icon= "hot_tub";
        t.transtatus= 0;
      result.listactivity.push(t);
      var s = new DoActivity()
        s.cid = 7;
        s.driverid = 135;
        s.docode = "202208312-27-21-1";
        s.lineimage = "";
        s.statusid = 20;
        s.statusname = "Engine start";
        s.statuswarn = "2022-08-31T10:15:00.000Z";
        s.statustaget = "2022-08-31T11:15:00.000Z";
        s.statustime = new Date("2024-09-10T12:09:18.000Z") ;
        s.showtime = "";
        s.statuslevel = 0;
        s.lat = 0;
        s.lng = 0;
        s.icon = "power_settings_new";
        s.transtatus = 0;
      result.listactivity.push(s);
      var o = new DoActivity()
        o.cid=  7;
        o.driverid=  135;
        o.docode=  "202208312-27-21-1";
        o.lineimage=  "";
        o.statusid=  25;
        o.statusname=  "On the way";
        o.statuswarn=  "2022-08-31T10:15:00.000Z";
        o.statustaget=  "2022-08-31T12:15:00.000Z";
        o.statustime= new Date("2024-09-10T12:09:07.000Z") ;
        o.showtime=  "";
        o.statuslevel=  0;
        o.lat=  0;
        o.lng=  0;
        o.icon=  "local_shipping";
        o.transtatus=  0
      result.listactivity.push(o);
      var f = new DoActivity()
        f.cid= 7,
        f.driverid= 135,
        f.docode= "202208312-27-21-1",
        f.lineimage= "",
        f.statusid= 30,
        f.statusname= "Finish",
        f.statuswarn= "2022-08-31T10:15:00.000Z",
        f.statustaget= "2022-08-31T13:00:00.000Z",
        f.statustime=  new Date("1999-12-31T17:00:00.000Z"),
        f.showtime= "",
        f.statuslevel= 0,
        f.lat= 0,
        f.lng= 0,
        f.icon= "check_circle",
        f.transtatus= 0
      result.listactivity.push(f);
      return result;
  }

  inputmessagetoline(e:any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

}