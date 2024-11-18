import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicledataModel } from '../../../models/datamodule.module'
import { variable } from '../../../variable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-searchvehiclepage',
  templateUrl: './searchvehiclepage.component.html',
  styleUrls: ['./searchvehiclepage.component.scss']
})

export class SearchvehiclepageComponent implements OnInit {

  constructor(private modalService: NgbModal, public va: variable) { }

  show = { Spinner: true, viewtype: 0 ,limit:10};
  keyword:string ="";
  public listvehicle : VehicledataModel[] = [];
  public activevehicle: VehicledataModel |undefined;

  async ngOnInit() {
    this.listvehicle = await this.getvehicle();
    this.show.Spinner = false;

  }

  async getvehicle() {
    var result: VehicledataModel[] = [];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'vehicle',keyword:this.keyword,limit:this.show.limit};
      console.log("getvehicle params : ", params);
      
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("getData jsondata : ", jsondata);
      if (jsondata.code == "000") {
        jsondata.data.forEach((data: any) => {
          var temp = new VehicledataModel(data);
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
    this.show.Spinner = true;
    this.listvehicle = await this.getvehicle();
    this.show.Spinner = false;
  }

  showvehicle(data: any, modal: any) {
    this.activevehicle = data;
    this.modalService.open(modal, { size: 'lg',backdrop: 'static',keyboard: false }); // 'sm', 'lg', 'xl' available sizes

    // this.modalService.open(modal, { fullscreen: true, scrollable: true });
  }
  
  async talkbackdata(data: VehicledataModel) {
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
      Sheets: { 'Drivers': worksheet },
      SheetNames: ['Drivers']
    };

    // Step 4: ส่งออก workbook เป็นไฟล์ Excel
    XLSX.writeFile(workbook, 'DriverData.xlsx');
  }





}