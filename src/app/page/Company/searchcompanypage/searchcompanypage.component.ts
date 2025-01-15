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
import * as XLSX from 'xlsx';

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

  show = { Spinner: true, viewtype: 0 ,addcompany:true,search:false};
  public companydata: CompanyModel[] = [];
  public displayedColumns: string[] = [];
  public displayedColumnsData: string[] = [];
  public activecompany: CompanyModel = new CompanyModel();
  // public  dataSource = new MatTableDataSource(this.companydata); 
  public dataSource = new MatTableDataSource(this.companydata);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  async ngOnInit(){
    if(await this.checktoken()){ 
      // do init process
    }
  }

  async checktoken(){
        this.va.token = this.va.gettoken();
    if(!this.va.token || this.va.token==""){ this.router.navigate(["login"]); return false;} 
    else{ await this.va.getprofile(); return true;}
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

  exportprint(){

  }

  exportexcel(){
    // Step 1: ลบฟิลด์ id, driverimg ออกจากข้อมูล
    const filteredData = this.companydata.map(({id,complogo, ...rest }) => rest);

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


  addcompany(modal: any){
    this.activecompany = new CompanyModel();
    this.modalService.open(modal, { size: 'lg', windowClass: 'custom-modal-lg',
      backdrop: 'static',keyboard: false,centered: true, });
    // this.modalService.open(modal, { fullscreen: true });
  }
  editcompany(comp: CompanyModel,modal: any){
    this.activecompany = comp;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, { size: 'lg', windowClass: 'custom-modal-lg',
      backdrop: 'static',keyboard: false,centered: true, });
    // this.modalService.open(modal, { fullscreen: true });
  }

  opencompanydata(comp: CompanyModel, modal: any) {
    // console.log("opencompanydata comp : ", comp);
    this.activecompany = comp;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, { fullscreen: true });
  }
  opencompanymap(comp: CompanyModel, modal: any) {
    this.activecompany = comp;
    // this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes
    this.modalService.open(modal, { fullscreen: true });
  }
  companytalkback(event: any) {
    var company :CompanyModel =event;
    if(company && company.id==0){
      this.setData();
    }else{
      this.activecompany = event;
      var index = this.companydata.findIndex(x => x.id == this.activecompany.id);
      this.companydata[index] = this.activecompany;
    }
    this.modalService.dismissAll();
  }
  

}
