import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleModel } from '../../../models/datamodule.module'
import { variable } from '../../../variable';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-searchvehiclepage',
  templateUrl: './searchvehiclepage.component.html',
  styleUrls: ['./searchvehiclepage.component.scss']
})

export class SearchvehiclepageComponent implements OnInit {

  constructor(private router: Router,private modalService:NgbModal,public va:variable,private dialog:MatDialog,private snacbar:MatSnackBar) { }

  show = { Spinner: true, viewtype: 0 ,limit:10,search:false};
  keyword:string ="";
  public listvehicle : VehicleModel[] = [];
  public activevehicle: VehicleModel |undefined;

  async ngOnInit() {
    if(await this.checktoken()){ 
      this.listvehicle = await this.getvehicle();
      this.show.Spinner = false;
    }
  }
  
  async checktoken(){
    this.va.token = this.va.gettoken();
    if(!this.va.token || this.va.token==""){ this.router.navigate(["login"]); return false;} 
    else{ await this.va.getprofile(); return true;}
  }

  async getvehicle() {
    var result: VehicleModel[] = [];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'vehicle',keyword:this.keyword,limit:this.show.limit};
      console.log("getvehicle params : ", params);
      
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("getData jsondata : ", jsondata);
      if (jsondata.code == "000") {
        jsondata.data.forEach((data: any) => {
          var temp = new VehicleModel(data);
          result.push(temp);
        });
      } 
      else {
        
      }  
    }catch(ex){console.log("getDriver Error :",ex)}
    console.log("getData result : ", result);
    return result;

  }
  async searchdata(){
    if(this.keyword==""){return;}
    this.show.Spinner = true;
    this.listvehicle = await this.getvehicle();
    this.show.search = false;
    this.show.Spinner = false;
  }

  showvehicle(data: any, modal: any) {
    this.activevehicle = data;
    this.modalService.open(modal, { size: 'lg',backdrop: 'static',keyboard: false }); // 'sm', 'lg', 'xl' available sizes

    // this.modalService.open(modal, { fullscreen: true, scrollable: true });
  }
  
  async talkbackdata(data: VehicleModel) {
    console.log("talkbackdata data",data)
    if(data){
      this.show.Spinner = true;
      this.keyword=data.vlicent
      this.listvehicle = await this.getvehicle();
      this.show.Spinner = false;
    }else{
      this.show.Spinner = true;
      this.listvehicle = await this.getvehicle();
      this.show.Spinner = false;
    }
  }

  addvehicle(modal:any){
    this.activevehicle = undefined;
    this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes

    // this.modalService.open(modal, { fullscreen: true, scrollable: true });
  }
  exportprint(){

  }
  exportexcel(){
    // Step 1: ลบฟิลด์ id, driverimg ออกจากข้อมูล
    const filteredData = this.listvehicle.map(({vid,driverimage,driverid,qrcode, ...rest }) => rest);

    // Step 2: สร้าง worksheet จากข้อมูลที่ถูกกรองแล้ว
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Step 3: สร้าง workbook และเพิ่ม worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Vehicle': worksheet },
      SheetNames: ['Vehicle']
    };

    // Step 4: ส่งออก workbook เป็นไฟล์ Excel
    XLSX.writeFile(workbook, 'VehicleData.xlsx');
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