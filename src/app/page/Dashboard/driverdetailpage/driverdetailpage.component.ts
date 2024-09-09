import { Component, Input,EventEmitter, Output, OnInit  } from '@angular/core';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Dashboarddata, DoData} from '../../../models/datamodule.module';
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
  //  console.log("activedriver : ",this.activedriver);
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
        var jsondata = await this.va.WsData(wsname, param, "");
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

}