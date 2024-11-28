import { Component, OnInit,ViewChild} from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {RouteModel} from './searchroutepage.module';

@Component({
  selector: 'app-searchroutepage',
  templateUrl: './searchroutepage.component.html',
  styleUrls: ['./searchroutepage.component.scss']
})

export class SearchroutepageComponent implements OnInit{
  constructor() {}
  public mainData : RouteModel[] = []; 
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
    // console.log(row);
  }

  applyFilter(event:any){
    var filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }


  async setData(){
    this.displayedColumns = ['company','routename','totaltrip','totalship0','totalship1','id','compid'];
    this.displayedColumnsData = ['company','routename','totaltrip','totalship0','totalship1','id','compid'];
    this.mainData = await  this.getData();
    this.dataSource = new MatTableDataSource(this.mainData); 
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  async getData(){
    return [
      {id: 30,routename: "สายLG - คลองกล่ำ",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 31,routename: "สายจุกกะเฌอ - คอนโดบ่อวิน",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 2,totalship0: 2,totalship1: 0},
      {id: 32,routename: "สายชลบุรี - ดอนหัวฬ่อ - บ้านบึง",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 33,routename: "สายชลบุรี - บางพระ",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 34,routename: "สายชลบุรี - ไร่กล้วย - สวนเสือ",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 35,routename: "สายบึงทอง - เขาขยาย",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 36,routename: "สายปลวกแดง - ตลาดล่าง",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 38,routename: "สายปลวกแดง - วังตาผิน",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 39,routename: "สายพัทยา (บางละมุง)",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 40,routename: "สายพัทยา (เคหะ-แหลมฉบัง-หนองคล้า)",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 41,routename: "สายพันเสด็จนอก - เสาสูง",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 42,routename: "สายพันเสด็จใน",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 43,routename: "สายมาบยางพร 1",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 2,totalship0: 2,totalship1: 0},
      {id: 44,routename: "สายมาบยางพร 2 ",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 2,totalship0: 2,totalship1: 0},
      {id: 46,routename: "สายระยอง 1  บ้านค่าย - ปากแพรก",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 47,routename: "สายระยอง 2  รพ.กรุงเทพระยอง - มาบข่า ",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 48,routename: "สายระยอง 3  เซ็นทรัลระยอง-นิคมพัฒนา",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 49,routename: "สายระยอง 4  ระยอง - แม่น้ำคู้ ",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 2,totalship0: 2,totalship1: 0},
      {id: 51,routename: "สายศรีราชา - เก้ากิโล - อ่าวอุดม",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 53,routename: "สายสัตหีบ",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 54,routename: "สายหนองก้างปลา - เชโก้",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 57,routename: "สายห้วยปราบ - สะพานสี่",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 2,totalship0: 2,totalship1: 0},
      {id: 58,routename: "สายอีสเทิร์น",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 2,totalship0: 2,totalship1: 0},
      {id: 60,routename: "สายเขาน้อย - วังแขยง",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 62,routename: "สายไทยออยล์ - เครือสหพัฒน์",compid: 1,company: "Adient (โรงใหญ่)",totaltrip: 2,totalship0: 2,totalship1: 0},
      {id: 1,routename: "ชลบุรี",compid: 2,company: "STI",totaltrip: 2,totalship0: 1,totalship1: 1},
      {id: 4,routename: "บึงทอง",compid: 2,company: "STI",totaltrip: 2,totalship0: 1,totalship1: 1},
      {id: 9,routename: "บ้านบึง",compid: 2,company: "STI",totaltrip: 2,totalship0: 1,totalship1: 1},
      {id: 10,routename: "ปลวกแดง",compid: 2,company: "STI",totaltrip: 5,totalship0: 3,totalship1: 2},
      {id: 15,routename: "ระยอง",compid: 2,company: "STI",totaltrip: 5,totalship0: 2,totalship1: 3},
      {id: 23,routename: "ศรีราชา",compid: 2,company: "STI",totaltrip: 5,totalship0: 3,totalship1: 2},
      {id: 25,routename: "สะพานสี่",compid: 2,company: "STI",totaltrip: 2,totalship0: 1,totalship1: 1},
      {id: 26,routename: "สัตหีบ",compid: 2,company: "STI",totaltrip: 2,totalship0: 1,totalship1: 1},
      {id: 70,routename: "เกาะโพธิ์",compid: 2,company: "STI",totaltrip: 2,totalship0: 1,totalship1: 1},
      {id: 71,routename: "เขาไม้แก้ว",compid: 2,company: "STI",totaltrip: 2,totalship0: 1,totalship1: 1},
      {id: 72,routename: "เครือ",compid: 2,company: "STI",totaltrip: 3,totalship0: 2,totalship1: 1},
      {id: 78,routename: "แหลมฉบัง-เครือ/อ่าวอุดม-บ้านนา",compid: 2,company: "STI",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 2,routename: "บึง (ปั้มเชลล์) ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 3,routename: "บึง(การไฟฟ้า) ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 11,routename: "ปากร่วม + สะพานสี่ ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 12,routename: "พัทยา ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 13,routename: "มาบข่า ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 14,routename: "มาบยางพร ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 18,routename: "วิ่งแทน บึง(การไฟฟ้า) ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 19,routename: "วิ่งแทน สายมาบข่า",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 20,routename: "วิ่งแทน ห้วยปราบ ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 21,routename: "วิ่งแทน ไร่กล้วย",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 22,routename: "วิ่งแทน ไลฟ์ซิตี้ปาร์ค ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 64,routename: "หนองมน",compid: 3,company: "คอลัมน์",totaltrip: 2,totalship0: 2,totalship1: 0},
      {id: 66,routename: "หนองยายบู่ ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 67,routename: "ห้วยปราบ ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 69,routename: "ฮาร์เบอร์มอลล์ + เครือสหพัฒน์ ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 79,routename: "โป่งสะเก็ด + อีสเทิร์น ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 80,routename: "ไร่กล้วย ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 81,routename: "ไลฟ์ซิตี้ปาร์ค ",compid: 3,company: "คอลัมน์",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 5,routename: "บึงทอง  3",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 6,routename: "บึงทอง 1",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 7,routename: "บึงทอง 2",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 8,routename: "บึงทอง 4",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 16,routename: "ลีโอ-ซอยสุพรรณ 1",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 17,routename: "ลีโอ-ซอยสุพรรณ 2",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 24,routename: "ศรีราชา-เก้ากิโล",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 27,routename: "สาย มาบยางพร",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 28,routename: "สาย วังแขยง",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 29,routename: "สาย อ่าวดุดม ",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 37,routename: "สายปลวกแดง - มาบยางพร",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 45,routename: "สายระยอง",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 50,routename: "สายวังตาผิน ",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 52,routename: "สายสวนเสือ ",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 55,routename: "สายหนองคล้า",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 56,routename: "สายหนองยายบู่",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 59,routename: "สายอีสเทิร์น",compid: 4,company: "เจเทค",totaltrip: 0,totalship0: 0,totalship1: 0},
      {id: 61,routename: "สายเคหะ",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 63,routename: "สายไร่กล้วย",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 65,routename: "หนองมน ",compid: 4,company: "เจเทค",totaltrip: 0,totalship0: 0,totalship1: 0},
      {id: 68,routename: "ห้วยปราบ - สะพานสี่",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 73,routename: "เครือสหพัฒน์ 1",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 74,routename: "เครือสหพัฒน์ 2",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 75,routename: "เครือสหพัฒน์ 3",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 76,routename: "แม่น้ำคู้ 1",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0},
      {id: 77,routename: "แม่น้ำคู้ 2 ",compid: 4,company: "เจเทค",totaltrip: 1,totalship0: 1,totalship1: 0}
    ]
      // "SELECT routeline.id,routeline.routename,routeline.compid,customer.company,\n" +
      // "IFNULL(totaltrip,0) as totaltrip,IFNULL(totalship0,0) as totalship0,\n" +
      // "IFNULL(totalship1,0) as totalship1\n" +
      // "FROM routeline\n" +
      // "INNER JOIN customer ON routeline.compid = customer.id\n" +
      // "LEFT JOIN (SELECT routeid, count(*) as totaltrip FROM planmaster\n" +
      // "GROUP BY routeid) as trip ON routeline.id = trip.routeid\n" +
      // "LEFT JOIN (SELECT routeid, count(*) as totalship0 FROM planmaster \n" +
      // "WHERE shipid='0'GROUP BY routeid) as ship0 ON routeline.id = ship0.routeid\n" +
      // "LEFT JOIN (SELECT routeid, count(*) as totalship1 FROM planmaster \n" +
      // "WHERE shipid='1'GROUP BY routeid) as ship1 ON routeline.id = ship1.routeid\n" +
      // "ORDER BY customer.company,routeline.routename"

  }

}