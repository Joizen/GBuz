import { Component, OnInit, Input } from '@angular/core';
import { CompanyModel, ComshiftModel } from 'src/app/models/datamodule.module';
import { variable } from '../../../variable';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-shiftpage',
  templateUrl: './shiftpage.component.html',
  styleUrls: ['./shiftpage.component.scss']
})
export class ShiftpageComponent implements OnInit {
  constructor(public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar) { }
  @Input() company: CompanyModel = new CompanyModel();
  show = {Spinner: true,viewtype:0,sendtime:"00:00",receivetime:"00:00",ottime:"00:00",save:false,delete:false};
  listcomshift:ComshiftModel[]=[];
  activeshift:ComshiftModel |undefined;
  selectedshift:ComshiftModel = new ComshiftModel();

  async ngOnInit() {
    this.listcomshift = await this.getshiftData();
    if (this.listcomshift.length>0){
      this.selectedshift= this.listcomshift[0];
      this.selecteddata( this.selectedshift);
    }
    this.show.Spinner = false;
  }

  async getshiftData() {
    var result: ComshiftModel[] = [];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'dllshift', compid: this.company.id };
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("getshiftData jsondata: ",jsondata);

      if (jsondata.code == "000") {      
        jsondata.data.forEach((data: any) => {
          var temp = new ComshiftModel(data);
          result.push(temp);
        });
        this.showSanckbar("getshiftData success",2);
      } else {
        this.showSanckbar("getshiftData fails"+ jsondata.message,2);
      }  
    }catch(ex){
      this.showSanckbar("getshiftData error"+ ex,2);
    }
    return result;
  }
  async refreshshift(){
    this.show.Spinner = true;
    this.listcomshift = await this.getshiftData();
    if (this.listcomshift.length>0){
      this.selectedshift= this.listcomshift[0];
      this.selecteddata( this.selectedshift);
    }
    this.show.Spinner = false;
  }
  selecteddata(data:ComshiftModel){
    this.activeshift=data;
    this.selectedshift =new ComshiftModel(data);
    this.show.sendtime = this.va.DateToString("HH:mm",data.sendtime);
    this.show.receivetime = this.va.DateToString("HH:mm",data.receivetime);
    this.show.ottime = this.va.DateToString("HH:mm",data.ottime);
    this.show.save=false;
    this.show.delete=true;
  }
  shifttimechange(type:string){
    // console.log("type : ",type);

    if(type=="sendtime"){
      const [hours, minutes] = this.show.sendtime.split(':').map(Number); 
      this.selectedshift.sendtime = new Date(this.selectedshift.sendtime.setHours(hours, minutes));
      if(this.activeshift&&!this.show.save){ this.show.save = (this.activeshift.sendtime !=this.selectedshift.sendtime);}
    }
    else if(type=="receivetime"){
      const [hours, minutes] = this.show.receivetime.split(':').map(Number); 
      this.selectedshift.receivetime = new Date(this.selectedshift.receivetime.setHours(hours, minutes));
      this.selectedshift.receivetime.setHours(hours, minutes);
      if(this.activeshift&&!this.show.save){ this.show.save = (this.activeshift.receivetime !=this.selectedshift.receivetime);}
    }
    else if(type=="ottime"){
      const [hours, minutes] = this.show.ottime.split(':').map(Number); 
      this.selectedshift.ottime = new Date(this.selectedshift.ottime.setHours(hours, minutes));
      if(this.activeshift&&!this.show.save){ this.show.save = (this.activeshift.ottime !=this.selectedshift.ottime);}
    }
    else {
      if(this.activeshift&&!this.show.save){ this.show.save = (this.activeshift.shift !=this.selectedshift.shift);}
    }
  }
  async saveshift(){
    if(this.selectedshift.shift.trim()!=""){
      try{     
        var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลกะงานนี้หรือไม่");
        if(confirm=="true"){
          if(await this.savedupdateshift()){
              this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลกะงานนี้เรียบร้อยแล้ว");
              await this.refreshshift();
            }else{
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลกะงานนี้ผิดพลาดโปรดลองอีกครัง");
            this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
          }
        }
      }catch(ex){
        console.log("saveshift error ",ex)
        this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
      }
    } 
  }
  async deleteshift(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการลบ","คุณต้องการลบข้อมูลกะงานนี้หรือไม่");
      if(confirm=="true"){
        this.selectedshift.transtatus=-3;
        if(await this.savedupdateshift()){
            this.alertMessage("แจ้งเตือน", "ลบข้อมูลข้อมูลกะงานนี้เรียบร้อยแล้ว");
            await this.refreshshift();
          }else{
          this.alertMessage("แจ้งเตือน", "ลบข้อมูลข้อมูลกะงานนี้ผิดพลาดโปรดลองอีกครัง");
          this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง");
        }
      }
    }catch(ex){
      console.log("deleteshift error ",ex)
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }

  }
  addshift(){
    this.selectedshift =new ComshiftModel();
    this.selectedshift.compid = this.company.id;
    this.selecteddata( this.selectedshift);
    this.activeshift=undefined;
    this.show.save=true;
    this.show.delete=false;
  }

  exportprint(){}
  exportexcel(){
    // Step 1: ลบฟิลด์ id, driverimg ออกจากข้อมูล
    const filteredData = this.listcomshift.map(({id, ...rest }) => rest);

    // Step 2: สร้าง worksheet จากข้อมูลที่ถูกกรองแล้ว
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Step 3: สร้าง workbook และเพิ่ม worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Company': worksheet },
      SheetNames: ['Company']
    };

    // Step 4: ส่งออก workbook เป็นไฟล์ Excel
    XLSX.writeFile(workbook, 'CompanyData.xlsx');
  }

  async savedupdateshift(){
    try{
      var tbname = "comshift" ;
      var wsname = this.selectedshift.transtatus==1?"updatedata":"deldata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,data:this.selectedshift});
      if(jsondata.code=="000"){ return true;}
    }catch(ex){
      console.log("saveupdateShift Error : ",ex);
      this.showSanckbar("save or update Shift error" + ex,2);
    }
    this.selectedshift.transtatus =(this.activeshift?this.activeshift.transtatus:0) ;
    return false;
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
