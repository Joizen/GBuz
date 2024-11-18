import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverdataModel } from '../../../models/datamodule.module'
import { variable } from '../../../variable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-searchdriverpage',
  templateUrl: './searchdriverpage.component.html',
  styleUrls: ['./searchdriverpage.component.scss']
})

export class SearchdriverpageComponent implements OnInit {

  constructor(private modalService: NgbModal, public va: variable) { }

  show = { Spinner: true, viewtype: 0 ,limit:10};
  keyword:string ="";
  public listdriver : DriverdataModel[] = [];
  public activedriver: DriverdataModel |undefined;

  async ngOnInit() {
    this.listdriver = await this.getDriver();
    this.show.Spinner = false;

  }

  async getDriver() {
    var result: DriverdataModel[] = [];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'driver',keyword:this.keyword,limit:this.show.limit};
      var jsondata = await this.va.getwsdata(wsname, params);
      // console.log("getData jsondata : ", jsondata);
      if (jsondata.code == "000") {
        jsondata.data.forEach((data: any) => {
          var temp = new DriverdataModel(data);
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
    this.listdriver = await this.getDriver();
    this.show.Spinner = false;
  }

  showDriver(data: any, modal: any) {
    this.activedriver = data;
    this.modalService.open(modal, { size: 'lg',backdrop: 'static',keyboard: false }); // 'sm', 'lg', 'xl' available sizes

    // this.modalService.open(modal, { fullscreen: true, scrollable: true });
  }
  
  async talkbackdata(data: DriverdataModel) {
    console.log("talkbackdata data",data)
    if(data){
      this.listdriver = [];
      this.listdriver.push(data);      
    }else{
      this.show.Spinner = true;
      this.listdriver = await this.getDriver();
      this.show.Spinner = false;
    }
  }

  adddriver(modal:any){
    this.activedriver = undefined;
    this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes

    // this.modalService.open(modal, { fullscreen: true, scrollable: true });
  }
  exportprint(){

  }
  exportexcel(){
    // Step 1: ลบฟิลด์ id, driverimg ออกจากข้อมูล
    const filteredData = this.listdriver.map(({id,vid,driverimg, ...rest }) => rest);

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



