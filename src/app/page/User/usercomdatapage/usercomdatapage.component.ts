import { Component,Input,EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { CompanyModel, UserModel } from 'src/app/models/datamodule.module';

@Component({
  selector: 'app-usercomdatapage',
  templateUrl: './usercomdatapage.component.html',
  styleUrls: ['./usercomdatapage.component.scss']
})
export class UsercomdatapageComponent implements OnInit {
  constructor( private modalService: NgbModal, public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar ) { }
  @Input() modal: any;
  @Input()  activeuser:  UserModel = new UserModel();
  @Input()  activecompany:  CompanyModel = new CompanyModel();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  listcustomer : CompanyModel[]=[];
  show = { Spinner: true };

  async ngOnInit() {
    if(this.activeuser.id!=0) {this.listcustomer = await this.getData();} 
    console.log("this.listcustomer : ",this.listcustomer);
    this.show.Spinner=false;
  }

  async getData() {
    var result: CompanyModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'company', empid: this.activeuser.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new CompanyModel(data);
        // temp.setdata(data);
        result.push(temp);
      });
    } else {

    }
    return result;

  }

 
  async deleteuser(){
    try{
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการลบผู้ใช้งาน "+ this.activeuser.empname + " ออกจากการดูแลบริษัทนี้หรือไม่");
      if(confirm=="true"){
        if(await this.setdeleteuser()){
            this.talk.emit();
            this.modal.close();
        }else{this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง");}
      }
    }catch(ex){
      console.log("OkCancelMessage error ",ex);
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง");
    }
  }

  async setdeleteuser(){
    try{
      var wsname = "deldata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:"usercompany",empid:this.activeuser.id,compid:this.activecompany.id});
      if(jsondata.code=="000"){
        this.showSanckbar("delete user of company success",2);
        return true;
      }
    }catch(ex){
      this.showSanckbar("delete  user of company Error" + ex,2);
      console.log("setdeleteuser Error : ",ex)
    }
    return false;
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
      // dialogRef.afterClosed().subscribe(result => {
      //   return result;
      // });
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
  

}

