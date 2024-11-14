import { Component, OnInit,Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { Companydata, Employeedata } from 'src/app/models/datamodule.module';
import { variable } from 'src/app/variable';


@Component({
  selector: 'app-employeecomppage',
  templateUrl: './employeecomppage.component.html',
  styleUrls: ['./employeecomppage.component.scss']
})

export class EmployeecomppageComponent implements OnInit{
  @Input() activecompany : Companydata = new Companydata();

  constructor(public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar ) { }
  show = { Spinner: true, type: 0 };
  public listuser: Employeedata[] = [];
  displayedColumns: string[] = ['image', 'empname', 'rolename', 'empcode', 'phone', 'companyname'];

  async ngOnInit() {
    // this.activecompany.id=7;
    console.log("Employeecomppage ngOnInit activecompany",this.activecompany)
    this.listuser = await this.getData();
  }

  async getData() {
    var result: Employeedata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'empcomp', compid: this.activecompany.id};
    var jsondata = await this.va.getwsdata(wsname, params);
    console.log("getData Employeedata jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new Employeedata(data);
        result.push(temp);
      });
    } else {
      this.showSanckbar("Get List of control User Erreo" + jsondata.message)
    }
    this.show.Spinner = false;
    return result;

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
