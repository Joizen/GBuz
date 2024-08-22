import { Component, OnInit, HostListener } from '@angular/core';
import { variable } from '../../variable'
import { DriverDashboard, DriverActivity, CompanyDashboard } from '../../models/datamodule.module'
@Component({
  selector: 'app-wakeupdashboard',
  templateUrl: './wakeupdashboard.component.html',
  styleUrls: ['./wakeupdashboard.component.scss']
})
export class WakeupdashboardComponent implements OnInit {
  

  constructor(private va: variable) { }

  public activedashboad : CompanyDashboard[]=[];
  public listdashboad = [];

  async ngOnInit() {
    await this.getdashboarddata();
  }

  async getdashboarddata() {
    var wsname = "getdata";
    var params = { tbname: "driverdashboard" };
    var header = "";
    var jsondata = await this.va.WsData(wsname, params, header);
    // console.log("getdashboarddata", jsondata);
    if (jsondata.code == "000") {
      this.listdashboad = jsondata.data;
      var listact: DriverActivity[] = [];
      this.listdashboad.forEach((item: any) => {
        var act = new DriverActivity();
        act.setdata(item);
        listact.push(act);
      });
      console.log("listact", listact[0]);

      var listdriver : DriverDashboard[] = [];
      const ld = this.listdashboad.reduce((acc:any, item:any) => {
        // ตรวจสอบว่ามีหมวดหมู่นี้ใน accumulator หรือไม่
        if (!acc[item.driverid]) {
          var driver = new DriverDashboard();
          driver.setdata(item);
          var act = listact.filter(x=>x.driverid==item.driverid);
          driver.listactivity = act;
          var wake = act.find(x=>x.statusid==5);
          if(wake){driver.wakestatus = (wake.transtatus==1)}
          listdriver.push(driver);
          acc[item.driverid] = []; // ถ้ายังไม่มี ให้สร้างอาร์เรย์ว่างสำหรับหมวดหมู่นั้น
        }
        // acc[item.driverid].push(item); // เพิ่มข้อมูลในหมวดหมู่ที่เกี่ยวข้อง
        return acc;
      }, {} as { [key: string]: any[] });

      console.log("listdriver",listdriver);

      this.activedashboad=[];
      const lc = this.listdashboad.reduce((acc:any, item:any) => {
        // ตรวจสอบว่ามีหมวดหมู่นี้ใน accumulator หรือไม่
        if (!acc[item.cid]) {
          var comp = new CompanyDashboard();
          comp.setdata(item);
          var driver = listdriver.filter(x=>x.cid==item.cid);
          comp.driverlist = driver;
          this.activedashboad.push(comp);
          acc[item.cid] = []; // ถ้ายังไม่มี ให้สร้างอาร์เรย์ว่างสำหรับหมวดหมู่นั้น
          
        }
        var ix = this.activedashboad.findIndex(x=>x.cid==item.cid);
        if(item.dstatus==5 && item.actvalue==1){ this.activedashboad[ix].totalwake+=1;}
        if(item.dstatus==10 && item.actvalue==1){ this.activedashboad[ix].totalalc+=1;}
        if(item.dstatus==15 && item.actvalue==1){ this.activedashboad[ix].totaltemp+=1;}
        if(item.dstatus==20 && item.actvalue==1){ this.activedashboad[ix].totalstart+=1;}
        if(item.dstatus==30 && item.actvalue==1){ this.activedashboad[ix].totalotw+=1;}
        if(item.dstatus==40 && item.actvalue==1){ this.activedashboad[ix].totalfinish+=1;}
        
        // acc[item.cid].push(item); // เพิ่มข้อมูลในหมวดหมู่ที่เกี่ยวข้อง
        return acc;
      }, {} as { [key: string]: any[] });

      this.activedashboad.forEach((item:any) => {
        item.totaldo = item.driverlist.length;
        
      });
      console.log("this.activedashboad",this.activedashboad);

    }

  }
}


