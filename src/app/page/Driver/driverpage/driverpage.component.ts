import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { Driverdata } from 'src/app/models/datamodule.module';
import { variable } from '../../../variable';

@Component({
  selector: 'app-driverpage',
  templateUrl: './driverpage.component.html',
  styleUrls: ['./driverpage.component.scss']
})
export class DriverpageComponent {
  constructor(public va: variable) { }

  @Input() modal: any;
  @Input() viewData: any;
  @Input() driverData: Driverdata = new Driverdata;
  @Output() repage: EventEmitter<any> = new EventEmitter<any>();

  // public Qrdata:string = JSON.stringify({empname:"thavon",surname:"seesai",phone:"093368131"});
  public Qrdata: string = "";

  ngOnInit(): void {
    console.log("this.driverData : ",this.driverData);
    if (this.viewData) {
      this.Qrdata = JSON.stringify({ empname: this.viewData.drivername, surname: this.viewData.surname, phone: this.viewData.phone });
    }
    else {
      this.Qrdata = JSON.stringify({ empname: this.driverData.empname, surname: this.driverData.surname, phone: this.driverData.phone });
      this.viewData = {
        lineimage : this.driverData.driverimg,
        driverfullname: this.driverData.fullname,
        drivername: this.driverData.empname,
        surname: this.driverData.surname,
        nickname: this.driverData.empname,
        license: this.driverData.licent,
        licensetype: "",
        phone: this.driverData.phone,
        mobile: this.driverData.phone,
        linename: this.driverData.linename,
      }
    }
    console.log("viewdata 2: ", this.viewData);
  }


}
