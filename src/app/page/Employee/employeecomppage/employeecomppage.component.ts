import { Component, OnInit,Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { Employeedata,Companydata } from '../../../models/datamodule.module'

@Component({
  selector: 'app-employeecomppage',
  templateUrl: './employeecomppage.component.html',
  styleUrls: ['./employeecomppage.component.scss']
})

export class EmployeecomppageComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) { }
  @Input() activecompany : Companydata = new Companydata();

  show = { Spinner: true, viewtype: 0 };
  public maindata: Employeedata[] = [];
  public activedata: Employeedata = new Employeedata();
  

  async ngOnInit() {
    console.log("Employeecomppage ngOnInit activecompany",this.activecompany)
    this.maindata = await this.getData();
  }



  async getData() {
    var result: Employeedata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'empcomp', compid: this.activecompany.id};
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new Employeedata();
        temp.setdata(data);
        result.push(temp);
      });
    } else {

    }
    this.show.Spinner = false;
    return result;

  }

  openempdata(item: Employeedata, modal: any) {
    console.log("opencompanydata comp : ", item);
    this.activedata = item;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, { fullscreen: true });

  }
  
  companytalkback(event: any) {

  }

}
