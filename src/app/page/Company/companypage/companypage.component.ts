import { Component,Input,EventEmitter,ViewChild,Output, OnInit   } from '@angular/core';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CompanyModel} from '../../../models/datamodule.module'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';
import { RoutecomppageComponent } from '../../Route/routecomppage/routecomppage.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { VehiclecomppageComponent } from '../../Vehicle/vehiclecomppage/vehiclecomppage.component';
import { UsercompageComponent } from '../../User/usercompage/usercompage.component';

@Component({
  selector: 'app-companypage',
  templateUrl: './companypage.component.html',
  styleUrls: ['./companypage.component.scss']
})

export class CompanypageComponent implements OnInit {
  @Input() modal: any;
  @Input() activecompany : CompanyModel = new CompanyModel();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(RoutecomppageComponent) routecomppage!: RoutecomppageComponent;
  @ViewChild(VehiclecomppageComponent) vehiclecomppage!: VehiclecomppageComponent;
  @ViewChild(UsercompageComponent) usercomppage!: UsercompageComponent;
  

  constructor(
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) {}
  show = {Spinner: true};
  ngOnInit(): void {
    this.show.Spinner=false;
    // console.log("Companypage ngOnInit activecompany",this.activecompany)
  }

  onTabChange(event: MatTabChangeEvent) {
    try{
      console.log("onTabChange ");
      console.log("onTabChange event",event);

      if (event.tab.textLabel === 'Route') {
        this.routecomppage.refreshpage();
        // Call the function in app-routecomppage when "Route" tab is selected
      } 
      else if (event.tab.textLabel === 'Vehicle') {
        this.vehiclecomppage.refreshpage();
      } 
      else if (event.tab.textLabel === 'User') {
        this.usercomppage.refreshpage();        
      } 
      else if (event.tab.textLabel === 'Drop Point') {

      }
  
    }catch(ex){console.log("onTabChange error",ex);}
  }


}
