import { Component, OnInit,ViewChild} from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {CompanyModel} from './searchcompanypage.module';

@Component({
  selector: 'app-searchcompanypage',
  templateUrl: './searchcompanypage.component.html',
  styleUrls: ['./searchcompanypage.component.scss']
})
export class SearchcompanypageComponent implements OnInit{
  constructor() {}
  public mainData : CompanyModel[] = []; 
  public displayedColumns: string[] =[];
  public displayedColumnsData: string[] =[]  ;
  // public  dataSource = new MatTableDataSource(this.mainData); 
  public  dataSource = new MatTableDataSource(this.mainData); 
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
      return this.mainData.reduce((accum:any, curr:any) => accum + curr.totalroute, 0);
    } else if(columnname=="totalemployee"){
      return this.mainData.reduce((accum:any, curr:any) => accum + curr.totalemployee, 0);
    }
  }

  async setData(){
    this.displayedColumns = ['id', 'company', 'totalroute', 'totalemployee'];
    this.displayedColumnsData = ['id', 'company', 'totalroute', 'totalemployee'];
    this.mainData = await this.getData();
    this.dataSource = new MatTableDataSource(this.mainData); 
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  async getData(){
    return [
      {id: 1, company: "Adient (โรงใหญ่)", totalroute: 0, totalemployee:0},
      {id: 2, company: "STI", totalroute: 0, totalemployee:0},
      {id: 3, company: "คอลัมน์", totalroute: 0, totalemployee:0},
      {id: 4, company: "เจเทค,", totalroute: 0, totalemployee:0},
    ];
  }

}
