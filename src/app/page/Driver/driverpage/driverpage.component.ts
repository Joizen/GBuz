import { Component,Input,EventEmitter, Output, OnInit } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-driverpage',
  templateUrl: './driverpage.component.html',
  styleUrls: ['./driverpage.component.scss']
})
export class DriverpageComponent {
  @Input() modal: any;
  @Input() viewData: any;
  @Output() repage: EventEmitter<any> = new EventEmitter<any>();

  // public Qrdata:string = JSON.stringify({empname:"thavon",surname:"seesai",phone:"093368131"});
  public Qrdata:string="";

  ngOnInit(): void{
    console.log("viewdata : ",this.viewData);
    this.Qrdata = JSON.stringify({empname:this.viewData.drivername,surname:this.viewData.surname,phone:this.viewData.phone});
    console.log("Qrdata : ",this.Qrdata);

  }


}
