import { Component, OnInit,Input,EventEmitter, Output  } from '@angular/core';
import { LineModel, UserModel } from 'src/app/models/datamodule.module';
import { variable } from 'src/app/variable';
import { DialogpageComponent, DialogConfig } from '../../material/dialogpage/dialogpage.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit{
  ShowRegister:boolean = false;
  @Input() modal: any;
  @Input() linedata: LineModel=new LineModel();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();

  constructor(public va:variable,private dialog: MatDialog, private snacbar: MatSnackBar) {}
  show = {Spinner: true};
  public userdata:UserModel = new UserModel();
  

  ngOnInit(): void {
    this.show.Spinner=false;
  }
  linelogin_Click(){
   this.ShowRegister = !this.ShowRegister;
  }

  async register_Click(){
    var msg ="ต้องการลงทะเบียนผู้ใช้งาน " +this.userdata.firstname+" "+this.userdata.surename +" Tel:"+this.userdata.phone +
    " ใช้งานร่วมกับไลน์นี้ หรือไม่";
    var confirm =await this.OkCancelMessage("ยืนยันการลงทะเบียนผู้ใช้งาน",msg);
    if(confirm){
      // register line
      if(await this.RegisterByline()){
        this.alertMessage("ลงทะเบียนเรียบร้อย","กรุณาลงชื่อเข้าใช้งาน");
        this.closeregister(true);
      }
    }
  }

  async RegisterByline(){
    try{
      var  wsname = "registerbyline";
      var param ={empname:this.userdata.firstname,surname:this.userdata.surename,phone:this.userdata.phone,linetoken:this.linedata.Token};
      var jsondata = await this.va.wsdata(wsname,param,"");
      console.log("onLogin jsondata : ", jsondata);
      if(jsondata.code=="000"){
        this.showSanckbar("Register success",2);
        return true;
      }
      else{
        this.alertMessage("Register Failed",jsondata.message);
      }
  
    }catch(ex){console.log("Register Error : ",ex)}
    return false;
  }

  closeregister(success:boolean){
    this.talk.emit(success);
    this.modal.close();
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

