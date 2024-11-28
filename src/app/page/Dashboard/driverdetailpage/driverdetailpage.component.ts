import { Component, Input,EventEmitter, Output, OnInit  } from '@angular/core';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { DashboardplanModel, PlanactivityModel} from '../../../models/datamodule.module';
import { variable } from '../../../variable';
import * as L from 'leaflet';

@Component({
  selector: 'app-driverdetailpage',
  templateUrl: './driverdetailpage.component.html',
  styleUrls: ['./driverdetailpage.component.scss']
})

export class DriverdetailpageComponent  implements OnInit{
  constructor(private modalService: NgbModal, config: NgbModalConfig ,public va: variable,private dialog: MatDialog, private snacbar: MatSnackBar) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  @Input() modal: any;
  @Input() activeplan : DashboardplanModel |undefined;
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  private drivermap: L.Map | undefined;
  private mapIconSize = 30;
  private vmarker :L.Marker|undefined;
  public locationname = "ไม่มีข้อมูล พิกัด GPS"
  ngOnInit(): void {
    // console.log("activeplan : ",this.activeplan); 
    this.initMap()
  }
     //--------------------- Leaflet  Map------------------------
  private initMap(): void {
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
    var lat = this.activeplan?.vlat;
    var lng = this.activeplan?.vlng;
    var header = this.activeplan?.fullname;
    var description = this.activeplan?.routename;
    var image = this.activeplan?.lineimage;
    if(lat&&lng&&lat!=0&&lng!=0){
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
    if(this.activeplan){
      if(this.activeplan.vlat!=0&&this.activeplan.vlng!=0){        
        this.drivermap?.panTo([this.activeplan.vlat,this.activeplan.vlng]);
      }
    }
  }
  async changestatus(activity:PlanactivityModel,value:number){
    var laststatus = activity.transtatus;
    var lastacttime = activity.statustime;
    try {
      // console.log("changestatus data :", activity);
      var msg = "คุณต้องการส่งข้อมูล " +  activity.statusname + "เข้าสูระบบใช่หรือไม่??" 
      if(value==0){ msg = "คุณต้องการยกเลิกข้อมูล " +  activity.statusname + "ในระบบใช่หรือไม่??" }
      var confirm =await this.OkCancelMessage("ยืนยันการส่งข้อมูล",msg);
      if(confirm=="true"){        
        activity.transtatus =value;
        activity.statustime = (value==0? this.va.defultdate  : new Date() );
        if(await this.updateactivity(activity)){
          if(await this.updatelastatus()){
            this.updateplanactivty(activity);
            this.talk.emit(this.activeplan);
            this.modal.close();
          } 
          else{
            this.showSanckbar("ปรับปรุงข้อมูล ผิดพลาดโปรดลองอีกครัง")
            activity.transtatus =laststatus;
            activity.statustime =lastacttime;
          } 
        }else{
          this.showSanckbar("ส่งข้อมูล ผิดพลาดโปรดลองอีกครัง")
          activity.transtatus =laststatus;
          activity.statustime =lastacttime;
        }
      }
    }
    catch (ex: any) {
      console.log("changestatus error :", ex);
      activity.transtatus =laststatus;
      activity.statustime =lastacttime;
    }
  }
  updateplanactivty(activity:PlanactivityModel){
    
    if(this.activeplan){
      if(activity.statusid==5){
        this.activeplan.wakeupact = activity.statustime;
      }
      else if(activity.statusid==10){
        // set Alcohol data
        this.activeplan.acltime = activity.statustime;
        this.activeplan.alcvalue = activity.statuslevel;
      }
      else if(activity.statusid==20){
        // set Start engine data
        this.activeplan.startwarnact= activity.statustime;
      }
      else if(activity.statusid==25){
        // set on the way data
        this.activeplan.startact  = activity.statustime;
      }
      else if(activity.statusid==30){
        // set Finiish data
        this.activeplan.finishtime  = activity.statustime;
      }
          // หาว่าหาข้อมูล Last Activity
      const maxstatus =  this.activeplan.listactivity
      .filter(x => x.transtatus !== 0)
      .sort((a, b) => b.statusid - a.statusid)[0];
      if (maxstatus) {
        this.activeplan.laststatus = maxstatus.statusid;
        this.activeplan.laststatuslevel = maxstatus.statuslevel;
        this.activeplan.laststatusname = maxstatus.statusname;
        this.activeplan.laststatustaget = maxstatus.statustaget;
        this.activeplan.laststatustime = maxstatus.statustime;
        this.activeplan.laststatuswarn = maxstatus.statuswarn;
        this.activeplan.laststatuscolor =this.va.getstatuscolor(this.activeplan.laststatus );
        // console.log("maxstatus:", maxstatus);
      }
    }

  }
  async updateactivity(data:PlanactivityModel){
    try{
      var wsname = "updatedriverstatus"
      var param={data:data}
      var jsondata = await this.va.getwsdata(wsname, param);
      return (jsondata.code == "000");
    }catch(ex){ console.log("updateactivity error :",ex) }
    return false;

  }
  async updatelastatus (): Promise<boolean>{
    if (this.activeplan) {
      const maxstatus = this.activeplan.listactivity
          .filter(x => x.transtatus !== 0)
          .sort((a, b) => b.statusid - a.statusid)[0];
      if (maxstatus) {
          this.activeplan.laststatus = maxstatus.statusid;
          this.activeplan.laststatuslevel = maxstatus.statuslevel;
          this.activeplan.laststatusname = maxstatus.statusname;
          this.activeplan.laststatustaget = maxstatus.statustaget;
          this.activeplan.laststatustime = maxstatus.statustime;
          this.activeplan.laststatuswarn = maxstatus.statuswarn;
          this.activeplan.laststatuscolor =this.va.getstatuscolor(this.activeplan.laststatus );
          // console.log("maxstatus:", maxstatus);
          return true;
      }
    }
    return false;
  }



  inputmessagetoline(e:any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  //===================================================================
  // #region  =========== Message Dialog ==============================

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

// #endregion  =========== Message Dialog ===========================
//===================================================================


}