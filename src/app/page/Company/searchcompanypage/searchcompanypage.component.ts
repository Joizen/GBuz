import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { CompanyModel } from '../../../models/datamodule.module'

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchcompanypage',
  templateUrl: './searchcompanypage.component.html',
  styleUrls: ['./searchcompanypage.component.scss']
})
export class SearchcompanypageComponent implements OnInit {
  constructor(
    private router: Router,
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) { }

  show = { Spinner: true, viewtype: 0 ,addcompany:true};
  public companydata: CompanyModel[] = [];
  public displayedColumns: string[] = [];
  public displayedColumnsData: string[] = [];
  public activecompany: CompanyModel = new CompanyModel();
  // public  dataSource = new MatTableDataSource(this.companydata); 
  public dataSource = new MatTableDataSource(this.companydata);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.checktoken();
  }
  checktoken(){
    var token = this.va.gettoken();
    // console.log("token : ",token);
    if(!token || token==""){
      this.router.navigate(["login"]);
    } 
   }

  ngAfterViewInit() {
    this.setData();
  }
  onSelectedRow(row: any) {
    // console.log(row);
  }

  applyFilter(event: any) {
    var filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  getSumdata(columnname: string) {
    if (columnname == "totalroute") {
      return this.companydata.reduce((accum: any, curr: any) => accum + curr.totalroute, 0);
    } else if (columnname == "totalemployee") {
      return this.companydata.reduce((accum: any, curr: any) => accum + curr.totalemployee, 0);
    }
  }

  async setData() {
    this.displayedColumns = ['id', 'company', 'totalroute', 'totalemployee'];
    this.displayedColumnsData = ['id', 'company', 'totalroute', 'totalemp'];
    this.companydata = await this.getData();
    this.dataSource = new MatTableDataSource(this.companydata);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.show.Spinner = false;

  }

  async getData() {
    var result: CompanyModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'company' };
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new CompanyModel(data);
        // temp.setdata(data);
        result.push(temp);
      });
    } else {

    }
    return result;

  }

  addcompany(modal: any){
    this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
  }

  opencompanydata(comp: CompanyModel, modal: any) {
    // console.log("opencompanydata comp : ", comp);
    this.activecompany = comp;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, { fullscreen: true });
  }
  companytalkback(event: any) {

  }
  

}
