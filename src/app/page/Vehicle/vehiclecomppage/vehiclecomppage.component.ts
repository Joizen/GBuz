import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { Vehicledata, Companydata, VehicleRoutedata } from '../../../models/datamodule.module'

@Component({
  selector: 'app-vehiclecomppage',
  templateUrl: './vehiclecomppage.component.html',
  styleUrls: ['./vehiclecomppage.component.scss']
})

export class VehiclecomppageComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) { }
  @Input() activecompany: Companydata = new Companydata();
  show = { Spinner: true, viewtype: 0 };
  public maindata: Vehicledata[] = [];
  public activedata: Vehicledata = new Vehicledata();
  

  async ngOnInit() {
    this.maindata = await this.getData();
    await this.SetVehicleRoute();

  }



  async getData() {
    var result: Vehicledata[] = [];
    var wsname = '_getdata';
    var params = { tbname: 'vehiclecomp', compid: this.activecompany.id };
    var jsondata = await this.va.WsData(wsname, params, '');
    console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new Vehicledata();
        temp.setdata(data);
        result.push(temp);
      });
    } else {

    }
    this.show.Spinner = false;
    return result;

  }

  async SetVehicleRoute() {
    var result: VehicleRoutedata[] = [];
    var wsname = '_getdata';
    var params = { tbname: 'vehicleroutecomp', compid: this.activecompany.id };
    var jsondata = await this.va.WsData(wsname, params, '');
    console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new VehicleRoutedata();
        temp.setdata(data);
        result.push(temp);
      });
      if (this.maindata) {
        this.maindata.forEach(vehicle => {
          var route = result.filter(x => x.vid == vehicle.vid);
          console.log("SetVehicleRoute route : ",route);
          if (route) { vehicle.listroute = route; }
          else { vehicle.listroute = []; }
        });
      }
    } else {

    }
    this.show.Spinner = false;
    return result;

  }


  openempdata(item: Vehicledata, modal: any) {
    console.log("opencompanydata comp : ", item);
    this.activedata = item;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, { fullscreen: true });

  }

  ShowVehicleDetail(vehicle:Vehicledata){
    console.log("ShowVehicleDetail : ",vehicle);
    this.activedata = vehicle;
  }

  companytalkback(event: any) {

  }

}
