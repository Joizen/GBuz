import { Component, OnInit, Input,ViewChild, ElementRef ,EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { DialogpageComponent, DialogConfig} from '../../../material/dialogpage/dialogpage.component';
import { CompanyModel } from 'src/app/models/datamodule.module';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import * as L from 'leaflet';


@Component({
  selector: 'app-companyprofilepage',
  templateUrl: './companyprofilepage.component.html',
  styleUrls: ['./companyprofilepage.component.scss'],
  providers: [DecimalPipe],
})
export class CompanyprofilepageComponent implements OnInit {
  constructor( private modalService: NgbModal, public va: variable,private decimalPipe: DecimalPipe, 
  private dialog: MatDialog, private snacbar: MatSnackBar) {}
  
  @Input() modal: any;
  @Input() editcompany:CompanyModel=new CompanyModel();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  show = {Spinner: true,save:false};
  private map: L.Map | undefined;
  private companymarker: L.Marker|undefined;  // company point 
  private mapIconSize = 30;
  
  activecompany:CompanyModel=new CompanyModel();
  
  async ngOnInit() {
    if(this.editcompany){this.activecompany=new CompanyModel(this.editcompany);}
    console.log("this.activecompany : ",this.activecompany);
    await this.initMap()
    this.show.Spinner=false;
  }
  onImageClick(){
    this.fileInput.nativeElement.click();
  }
  async initMap() {
    try {
      // console.log("this.map : ", this.map);
      this.map = L.map('companymap', {
        center: [13.6140328, 100.6162229], // Latitude and longitude of the center point
        zoom: 13, // Initial zoom level
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
          }),
        ],
      });
      this.setcompanymarker();
      return true;
    }
    catch (ex) { console.log("initMap error : ", ex); }
    return false
  }
  public setcompanymarker(){
    if(this.map){
      var zoom = this.map.getZoom();
      if (!this.companymarker){
        // new  startmarker
        const zoomLevel = zoom;
        const zl = zoomLevel?zoomLevel:13;
        const newSize = this.mapIconSize * (zl / 13); 
        const customIcon = L.divIcon({
          html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                  <img src="${this.va.icon.company}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                </div>`,
          className: '', // Remove default styling
          iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
          iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
        });    
        this.companymarker =L.marker([this.activecompany.lat, this.activecompany.lng],{ icon: customIcon, draggable: true }).addTo(this.map);
        const resizeMarkerIcon = () => {
          const zoomLevel = this.map?.getZoom();
          
          // Calculate new size based on zoom level (adjust the scaling factor as needed)
          const zl = zoomLevel?zoomLevel:13;
          const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level
        
          // Update the marker icon size
          this.companymarker?.setIcon(
            L.divIcon({
              html:`<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                <img src="${this.va.icon.company}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
              </div>`,
              className: '', // Remove default styling
              iconSize: [newSize, newSize*2], // Adjust size for side-by-side images
            })
          );
        };
        this.companymarker.bindPopup(this.activecompany.companyname);
        this.companymarker.on('dragend', (event) => {
          const newLatLng = event.target.getLatLng();
          this.activecompany.lat = this.formatnum(newLatLng.lat) ;
          this.activecompany.lng = this.formatnum(newLatLng.lng);
        });
      }else{
        // update startmarker
        this.companymarker.setLatLng([this.activecompany.lat, this.activecompany.lng]);
      }
      this.map.panTo(new L.LatLng(this.activecompany.lat, this.activecompany.lng));
  
    }
  }
  onLocationChange(event: any) {
    if(this.map){
      if(this.companymarker){ this.companymarker.setLatLng([this.activecompany.lat, this.activecompany.lng]);}
      this.map.panTo(new L.LatLng(this.activecompany.lat, this.activecompany.lng));
    }
  }   
  formatnum(dnum: number): number {
    if (!isNaN(dnum)) {
      const formatted = this.decimalPipe.transform(dnum, '1.6-6');
      return formatted==null?0: parseFloat(formatted);
    }
    return 0;
  }
  async getGoogleAddress() {
    var address =await this.va.getAddress(this.activecompany.lat, this.activecompany.lng);
    console.log("getGoogleAddress : ",address);
    if(address){ this.activecompany.address = address;}
  }


  async onFileSelected(event: Event) {
    // console.log("onFileSelected event",event)
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = async (e) =>{        
        const result = e.target?.result as string; // Base64 string with MIME type
        this.show.Spinner=true;
        if(await this.savedlogo(result)){
          this.activecompany.complogo = result;
          this.editcompany.complogo = result;
        }
        this.show.Spinner=false;
      };
      reader.readAsDataURL(file);

    }
  }
  
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';  // Reset the height to auto to shrink the textarea
    textarea.style.height = `${textarea.scrollHeight}px`;  // Set the height to the scrollHeight to adjust it based on content
  }

  async savecompany(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลบริษัทหรือไม่");
      if(confirm=="true"){
        if(await this.savedupdatecompany()){
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลบริษัทเรียบร้อยแล้ว");
            this.editcompany=this.activecompany;
            this.talk.emit(this.editcompany);
            this.modal.close();
        }else{
          this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลบริษัทผิดพลาดโปรดลองอีกครัง");
          this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
        }
      }
    }catch(ex){
      console.log("save company error ",ex)
      this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }

  }

  async savedupdatecompany(){
    try{
      var tbname = "company" ;
      var wsname = "updatedata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,data:this.activecompany});
      if(jsondata.code=="000"){return true;}
    }catch(ex){
      console.log("saveupdate Company Error : ",ex);
      this.showSanckbar("save or update Company Position error" + ex,2);
    }
    return false;
  }
  async savedlogo(image:string){
    try{
      var tbname = "companylogo" ;
      var wsname = "updatedata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,compid:this.activecompany.id,logo:image});
      if(jsondata.code=="000"){return true;}
    }catch(ex){
      console.log("save Company logo Error : ",ex);
      this.showSanckbar("save Company logo error" + ex,2);
    }
    return false;
  }

  async deletecompany(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการลบ","คุณต้องการลบข้อมูลบริษัทหรือไม่");
      if(confirm=="true"){
        this.activecompany.transtatus=-3;
        if(await this.savedupdatecompany()){
            this.alertMessage("แจ้งเตือน", "ลบข้อมูลบริษัทเรียบร้อยแล้ว");
            this.editcompany=new CompanyModel();
            this.talk.emit(this.editcompany);
            this.modal.close();
        }else{
          this.alertMessage("แจ้งเตือน", "ลบข้อมูลบริษัทผิดพลาดโปรดลองอีกครัง");
          this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง");
        }
      }
    }catch(ex){
      console.log("delete company error ",ex)
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }
//   closemodal(){
//     this.talk.emit(this.editcompany);
//     this.modal.close();
// }

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
      return dialogRef.afterClosed().toPromise();
    }catch(ex){
      // console.log("OkCancelMessage error ",ex)
      return Promise.reject(ex); // If there's an error, reject the promise
    }
  }

  showSanckbar(message: string, duration = 5) {
    this.snacbar.open(message, 'Close',
      { duration: (duration * 1000), horizontalPosition: 'center', verticalPosition: 'bottom' });
  }
}
