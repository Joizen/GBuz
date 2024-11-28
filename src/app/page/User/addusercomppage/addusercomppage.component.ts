import { Component,Input,EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { CompanyModel, UserModel } from 'src/app/models/datamodule.module';


@Component({
  selector: 'app-addusercomppage',
  templateUrl: './addusercomppage.component.html',
  styleUrls: ['./addusercomppage.component.scss']
})
export class AddusercomppageComponent implements OnInit {
  constructor( private modalService: NgbModal, public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar ) { }
  @Input() modal: any;
  @Input()  activecompany:  CompanyModel = new CompanyModel();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  listuser : UserModel[]=[];
  showSave:boolean = true;
  show = { Spinner: true ,Save: false};

  async ngOnInit() {
    if(this.activecompany.id!=0) {this.listuser = await this.getData();} 
    // console.log("this.listuser : ",this.listuser);
    this.show.Spinner=false;
  }

  async getData() {
    var result: UserModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'unusercustomer', compid: this.activecompany.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new UserModel(data);
        // temp.setdata(data);
        result.push(temp);
      });
    } else {

    }
    return result;

  }

  onSelectuser(event:any){
    var list = this.listuser.filter(x=>x.isselect);
    this.show.Save  =(list&&list.length>0)
  }

  async saveuser(){    
    try{
      var listuser = {name:"",id:""};
      var list = this.listuser.filter(x=>x.isselect);
      if(list&&list.length>0){
        list.forEach(user => {
          listuser.name+= ((listuser.name==""?"":", ") +user.empname);
          listuser.id+= ((listuser.id==""?"'":",'") +user.id + "'");
        });
      }
      else{return;}

      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการเพิ่มผู้ใช้งาน "+ listuser.name + " ดูแลบริษัทนี้หรือไม่");
      if(confirm=="true"){
        if(await this.saveupdateuser(listuser.id)){
            this.talk.emit();
            this.modal.close();
        }else{this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")}
      }
    }catch(ex){
      console.log("save plan error ",ex)
      this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }

  async saveupdateuser(listuser:string){
    try{
      var wsname = "updatedata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:"usercompany",data:{listuid:listuser,compid:this.activecompany.id}})
      if(jsondata.code=="000"){
        this.showSanckbar("save or update user in company success",2);
        return true;
      }
    }catch(ex){
      console.log("saveupdateplan Error : ",ex)
      this.showSanckbar("save or update user in company  error" + ex,2);

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
