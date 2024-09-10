import { Component, OnInit,ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import {Companydata} from '../../../models/datamodule.module'

import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-searchcompanypage',
  templateUrl: './searchcompanypage.component.html',
  styleUrls: ['./searchcompanypage.component.scss']
})
export class SearchcompanypageComponent implements OnInit{
  constructor(
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) {}

  show = {Spinner: true,viewtype:0};
  public companydata : Companydata[] = []; 
  public displayedColumns: string[] =[];
  public displayedColumnsData: string[] =[]  ;
  public activecompany : Companydata = new Companydata(); 
  // public  dataSource = new MatTableDataSource(this.companydata); 
  public  dataSource = new MatTableDataSource(this.companydata); 
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.setData();    
  }
  onSelectedRow(row:any){
    console.log(row);
  }

  applyFilter(event:any){
    var filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  getSumdata(columnname:string){
    if(columnname=="totalroute"){
      return this.companydata.reduce((accum:any, curr:any) => accum + curr.totalroute, 0);
    } else if(columnname=="totalemployee"){
      return this.companydata.reduce((accum:any, curr:any) => accum + curr.totalemployee, 0);
    }
  }

  async setData(){
    this.displayedColumns = ['id', 'company', 'totalroute', 'totalemployee'];
    this.displayedColumnsData = ['id', 'company', 'totalroute', 'totalemp'];
    this.companydata = await this.getData();
    this.dataSource = new MatTableDataSource(this.companydata); 
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async getData(){
    var result:Companydata[] =[]; 
    var wsname = '_getdata';
    var params = { tbname: 'company', uid: 1 };
    var jsondata = await this.va.WsData(wsname, params, '');
    console.log("getData jsondata : ",jsondata);
    if(jsondata.code=="000"){
      jsondata.data.forEach((data:any) => {
        var temp = new Companydata();
        temp.setdata(data);
        result.push(temp);
      });
    }else{

    }
    this.show.Spinner = false;
    return result;
    
  }

  opencompanydata(comp:Companydata, modal:any){
    console.log("opencompanydata comp : ",comp);
    this.activecompany = comp;
    this.modalService.open(modal, { size: 'lg' }); // 'sm', 'lg', 'xl' available sizes

  }
  companytalkback(event:any){

  }

}
