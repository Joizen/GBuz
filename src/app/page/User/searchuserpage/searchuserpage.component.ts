import { Component,OnInit} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from '../../../models/datamodule.module'
import { variable } from '../../../variable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-searchuserpage',
  templateUrl: './searchuserpage.component.html',
  styleUrls: ['./searchuserpage.component.scss']
})

export class SearchuserpageComponent implements OnInit {

  constructor(private modalService: NgbModal, public va: variable) { }

  show = { Spinner: true, viewtype: 0 ,limit:10};
  keyword:string ="";
  public listuser : UserModel[] = [];
  public activedriver: UserModel |undefined;

  async ngOnInit() {
    this.listuser = await this.getdata();
    this.show.Spinner = false;

  }

  async getdata() {
    var result: UserModel[] = [];
    try{
      var wsname = 'getdata';
      var params = { tbname: 'usercustomer',keyword:this.keyword,limit:this.show.limit};
      var jsondata = await this.va.getwsdata(wsname, params);
      console.log("getData jsondata : ", jsondata);
      if (jsondata.code == "000") {
        jsondata.data.forEach((data: any) => {
          var temp = new UserModel(data);
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
    this.listuser = await this.getdata();
    this.show.Spinner = false;
  }

  showDriver(data: any, modal: any) {
    this.activedriver = data;
    console.log( "this.activedriver ", this.activedriver  )
    this.modalService.open(modal, { size: 'lg',backdrop: 'static',keyboard: false }); // 'sm', 'lg', 'xl' available sizes

    // this.modalService.open(modal, { fullscreen: true, scrollable: true });
  }
  
  async talkbackdata(data: UserModel) {
    console.log("talkbackdata data",data)
    if(data){
      this.show.Spinner = true;
      this.keyword=data.firstname
      this.listuser = await this.getdata();
      this.show.Spinner = false;
    }else{
      this.show.Spinner = true;
      this.listuser = await this.getdata();
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
    const filteredData = this.listuser.map(({id,userimage,linename,transtatus,isselect, ...rest }) => rest);

    // Step 2: สร้าง worksheet จากข้อมูลที่ถูกกรองแล้ว
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Step 3: สร้าง workbook และเพิ่ม worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'User': worksheet },
      SheetNames: ['User']
    };

    // Step 4: ส่งออก workbook เป็นไฟล์ Excel
    XLSX.writeFile(workbook, 'UserData.xlsx');
  }





}
