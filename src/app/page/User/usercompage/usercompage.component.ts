import { Component, OnInit, Input } from '@angular/core';
import { Companydata,UserModel } from '../../../models/datamodule.module'
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
  @Input() activecompany: Companydata = new Companydata();
  public maindata:  UserModel[] = [];
  show = { Spinner: true };

  async ngOnInit()  {
    this.maindata = await this.getData();
  }

  async getData() {
    var result: UserModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'usercustomer', compid: this.activecompany.id };
    var jsondata = await this.va.getwsdata(wsname, params);
    console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new UserModel();
        temp.setdata(data);
        result.push(temp);
      });
    } else {

    }
    this.show.Spinner = false;
    return result;

  }



  
}
