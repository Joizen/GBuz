import { Component, OnInit, Input,ViewChild, ElementRef  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { DialogpageComponent, DialogConfig} from '../../../material/dialogpage/dialogpage.component';
import { CompanyModel } from 'src/app/models/datamodule.module';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-companyprofilepage',
  templateUrl: './companyprofilepage.component.html',
  styleUrls: ['./companyprofilepage.component.scss']
})
export class CompanyprofilepageComponent implements OnInit {
  constructor( private modalService: NgbModal, public va: variable, 
    private dialog: MatDialog, private snacbar: MatSnackBar,private fb: FormBuilder) {
      this.companyForm = this.fb.group({
        companyName: ['', Validators.required],
        logo: [null],
        address: ['', Validators.required],
        contact: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]]
      });
    }
  @Input() modal: any;
  @Input() editcompany:CompanyModel|undefined;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  show = {Spinner: true,save:false};
  private map: L.Map | undefined;
  activecompany:CompanyModel=new CompanyModel();
  companyForm: FormGroup;
  imageUrl: string | ArrayBuffer |undefined | null = null ;
  
  async ngOnInit() {
    this.show.Spinner=false;
    await this.initMap()
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
      return true;
    }
    catch (ex) { console.log("initMap error : ", ex); }
    return false
  }


  onFileSelected(event: Event): void {
    // console.log("onFileSelected event",event)
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {        
        this.imageUrl = e.target?.result;
      };

      reader.readAsDataURL(file);
    }
  }

  savecompany(){

  }
  deletecompany(){

  }
  onSubmit(){
    if(this.companyForm){
      if (this.companyForm.valid) {
        const formData = this.companyForm.value;
        // console.log(formData);
        // Further processing or saving logic here
      }  
    }
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
