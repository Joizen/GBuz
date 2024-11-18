import { Component, OnInit, Input } from '@angular/core';
import { CompanyModel,UserModel } from '../../../models/datamodule.module'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';

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
  show = { Spinner: true };
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


  
}
