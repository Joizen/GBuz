import { Component, OnInit, Input } from '@angular/core';
import { CompanyModel,UserModel } from '../../../models/datamodule.module'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-usercompage',
  templateUrl: './usercompage.component.html',
  styleUrls: ['./usercompage.component.scss']
})
export class UsercompageComponent implements OnInit {
  constructor( private modalService: NgbModal, public va: variable,
    private dialog: MatDialog, private snacbar: MatSnackBar
  ) { }
  @Input() activecompany: CompanyModel = new CompanyModel();
  public maindata:  UserModel[] = [];
  public activeuser:  UserModel = new UserModel();
  show = { Spinner: true,viewtype:0 };
  async ngOnInit()  {
    console.log("ngOnInit : this.va.icon.user ",this.va.icon.user);
    
    this.maindata = await this.getData();
  }
  async refreshpage(){
    console.log("Usercomppage.refreshdata : ");
    // await this.showroutetab(this.show.viewtype);
  }

  async getData() {
    var result: UserModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'usercustomer', compid: this.activecompany.id };
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
    this.show.Spinner = false;
    return result;

  }

  Showuser(user:any,modal:any){
    this.activeuser = user;
    this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
  }

  addnewuser(modal:any){
    this.activeuser = new UserModel();
    this.modalService.open(modal, {backdrop: 'static',size: 'lg', keyboard: false, centered: true});
  }
  async refreshuserlist(){
    this.maindata = await this.getData();
  }
  exportprint(){}

  exportexcel(){
    // Step 1: ลบฟิลด์ id, driverimg ออกจากข้อมูล
    const filteredData = this.maindata.map(({id,userimage ,linename,isselect, ...rest }) => rest);
    // Step 2: สร้าง worksheet จากข้อมูลที่ถูกกรองแล้ว
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    // Step 3: สร้าง workbook และเพิ่ม worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { 'User': worksheet },
      SheetNames: ['User']
    };
    // Step 4: ส่งออก workbook เป็นไฟล์ Excel
    XLSX.writeFile(workbook, 'UserInCompanyData.xlsx');
  }

  
}
