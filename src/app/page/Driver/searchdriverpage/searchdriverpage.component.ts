import { Component, ViewChild, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Driverdata } from '../../../models/datamodule.module'
import { variable } from '../../../variable';

@Component({
  selector: 'app-searchdriverpage',
  templateUrl: './searchdriverpage.component.html',
  styleUrls: ['./searchdriverpage.component.scss']
})

export class SearchdriverpageComponent implements OnInit {

  constructor(private modalService: NgbModal, public va: variable) { }

  show = { Spinner: true, viewtype: 0 };
  public listdriver : Driverdata[] = [];

  public mainData: DriverModel[] = [];
  public displayedColumns: string[] = [];
  public displayedColumnsData: string[] = [];
  public dataSource = new MatTableDataSource(this.mainData);
  public listdata = [];
  public viewtype = false;
  public activedata: any;
  public activedriver: Driverdata |undefined;


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  async ngOnInit() {
    this.listdriver = await this.getDriver();
  }


  async getDriver() {
    var result: Driverdata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'driver'};
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getData jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new Driverdata(data);
        result.push(temp);
      });
    } else {

    }
    this.show.Spinner = false;
    return result;

  }

  showDriverDetail(data: Driverdata, modal: any) {
    console.log("activedriver", this.activedriver);
    this.activedriver = data;
    this.modalService.open(modal, { size:'lg'});
  }




  ngAfterViewInit() {
    this.setData();
  }
  async setData() {
    this.displayedColumns = ['id', 'driverfullname', 'drivername', 'surname', 'nickname', 'license', 'licensetype', 'phone', 'mobile', 'linename', 'lineimage'];
    this.displayedColumnsData = [...this.displayedColumns, 'action'];
    this.mainData = await this.getData();
    this.dataSource = new MatTableDataSource(this.mainData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.listdata = await this.getData();
  }

  applyFilter(event: any) {
    var filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  onSelectedRow(row: any) {
    console.log(row);

  }

  async getData() {
    return [
      { id: 1, driverfullname: "ปฐมพร โรจน์ฤทธิไกร", drivername: "ปฐมพร", surname: "โรจน์ฤทธิไกร", nickname: "กาย", license: "2 กฒ 7938", licensetype: "รถเก๋ง", phone: "097-1076196", mobile: "0971076196", lineid: "0953699553", linename: "GPS KRY (PRG)", lineimage: "" },
      // {id: 1, driverfullname: "กรวิชญ์ ขำนอก", drivername: "กรวิชญ์", surname: "ขำนอก", nickname: "", license: "", licensetype: "", phone: "097-1076196", mobile: "0971076196", lineid: "", linename: "", lineimage: ""}, 
      { id: 2, driverfullname: "กฤษตฤณ กิตติพงศ์วิวัฒน์", drivername: "กฤษตฤณ", surname: "กิตติพงศ์วิวัฒน์", nickname: "", license: "", licensetype: "", phone: "099-3563222", mobile: "0993563222", lineid: "", linename: "", lineimage: "" },
      { id: 3, driverfullname: "กลิ่นวิเศษ 080-572-1993", drivername: "ปราการ", surname: "กลิ่นวิเศษ", nickname: "", license: "", licensetype: "", phone: "080-572-1993", mobile: "0805721993", lineid: "", linename: "", lineimage: "" },
      { id: 4, driverfullname: "กองคำสุก 062-210-5690", drivername: "สิทธิศักดิ์", surname: "กองคำสุก", nickname: "", license: "", licensetype: "", phone: "062-210-5690", mobile: "0622105690", lineid: "", linename: "", lineimage: "" },
      { id: 5, driverfullname: "คล้ายแสง 097-928-7851", drivername: "พิชัย", surname: "คล้ายแสง", nickname: "", license: "", licensetype: "", phone: "097-928-7851", mobile: "0979287851", lineid: "", linename: "", lineimage: "" },
      { id: 6, driverfullname: "ฉลาด พินิจมนตรี", drivername: "ฉลาด", surname: "พินิจมนตรี", nickname: "", license: "", licensetype: "", phone: "093-693-0652", mobile: "0936930652", lineid: "", linename: "", lineimage: "" },
      { id: 7, driverfullname: "ชัยประสิทธิ์ 089-685-6770", drivername: "สงัด", surname: "ชัยประสิทธิ์", nickname: "", license: "", licensetype: "", phone: "089-685-6770", mobile: "0896856770", lineid: "", linename: "", lineimage: "" },
      { id: 8, driverfullname: "ชาญชัย คำพินิจ", drivername: "ชาญชัย", surname: "คำพินิจ", nickname: "", license: "", licensetype: "", phone: "087-747-8124", mobile: "0877478124", lineid: "", linename: "", lineimage: "" },
      { id: 9, driverfullname: "ชึรัมย์ 085-633-9506", drivername: "ชอบ", surname: "ชึรัมย์", nickname: "", license: "", licensetype: "", phone: "085-633-9506", mobile: "0856339506", linename: "", lineimage: "" },
      { id: 10, driverfullname: "ณัฐพงษ์  อาจฤทธิ์", drivername: "ณัฐพงษ์", surname: "อาจฤทธิ์", nickname: "", license: "", licensetype: "", phone: "095-2530152", mobile: "0952530152", linename: "", lineimage: "" },
      { id: 11, driverfullname: "ณัฐพล แซ่เล้า", drivername: "ณัฐพล", surname: "แซ่เล้า", nickname: "", license: "", licensetype: "", phone: "062-8861694", mobile: "0628861694", linename: "", lineimage: "" },
      { id: 12, driverfullname: "ณัฐศักดิ์  เสียงดัง", drivername: "ณัฐศักดิ์", surname: "เสียงดัง", nickname: "", license: "", licensetype: "", phone: "061-4793484", mobile: "0614793484", linename: "", lineimage: "" },
      { id: 13, driverfullname: "ตุลา 082-541-5986", drivername: "ศราวุฒิ", surname: "ตุลา", nickname: "", license: "", licensetype: "", phone: "082-541-5986", mobile: "0825415986", linename: "", lineimage: "" },
      { id: 14, driverfullname: "ทนัด จิตหาญ", drivername: "ทนัด", surname: "จิตหาญ", nickname: "", license: "", licensetype: "", phone: "080-602-6239", mobile: "0806026239", linename: "", lineimage: "" },
      { id: 15, driverfullname: "ทองตรีพันธ์ 085-047-9024", drivername: "เดโช", surname: "ทองตรีพันธ์", nickname: "", license: "", licensetype: "", phone: "085-047-9024", mobile: "0850479024", linename: "", lineimage: "" },
      { id: 16, driverfullname: "ธวัชชัย โมมขุนทด", drivername: "ธวัชชัย", surname: "โมมขุนทด", nickname: "", license: "", licensetype: "", phone: "083-6892898", mobile: "0836892898", linename: "", lineimage: "" },
      { id: 17, driverfullname: "นาย จิตรเจริญ จันตุลัง", drivername: "จิตรเจริญ", surname: "จันตุลัง", nickname: "", license: "", licensetype: "", phone: "095-1159397", mobile: "0951159397", linename: "", lineimage: "" },
      { id: 18, driverfullname: "นาย ชนะพันธ์ ยศจังหรีด", drivername: "ชนะพันธ์", surname: "ยศจังหรีด", nickname: "", license: "", licensetype: "", phone: "084-4637265", mobile: "0844637265", linename: "", lineimage: "" },
      { id: 19, driverfullname: "นาย ชวลิต สมประสงค์", drivername: "ชวลิต", surname: "สมประสงค์", nickname: "", license: "", licensetype: "", phone: "065-4814027", mobile: "0654814027", linename: "", lineimage: "" },
      { id: 20, driverfullname: "นาย ณรงค์ คำโมง", drivername: "ณรงค์", surname: "คำโมง", nickname: "", license: "", licensetype: "", phone: "098-5174483", mobile: "0985174483", linename: "", lineimage: "" },
      { id: 21, driverfullname: "นาย ณัฐธนนท์ น้อยเชียงคูณ", drivername: "ณัฐธนนท์", surname: "น้อยเชียงคูณ", nickname: "", license: "", licensetype: "", phone: "087-6560889", mobile: "0876560889", linename: "", lineimage: "" },
      { id: 22, driverfullname: "นาย ณัทพล เนวิลัย", drivername: "ณัทพล", surname: "เนวิลัย", nickname: "", license: "", licensetype: "", phone: "065-6479493", mobile: "0656479493", linename: "", lineimage: "" },
      { id: 23, driverfullname: "นาย นพเก้า สิงห์ชัย", drivername: "นพเก้า", surname: "สิงห์ชัย", nickname: "", license: "", licensetype: "", phone: "091-8944591", mobile: "0918944591", linename: "", lineimage: "" },
      { id: 24, driverfullname: "นาย บรรเลงศักดิ์ โสมมี", drivername: "บรรเลงศักดิ์", surname: "โสมมี", nickname: "", license: "", licensetype: "", phone: "086-8374634", mobile: "0868374634", linename: "", lineimage: "" },
      { id: 25, driverfullname: "นาย ประทีป สินชัย", drivername: "ประทีป", surname: "สินชัย", nickname: "", license: "", licensetype: "", phone: "099-3432462", mobile: "0993432462", linename: "", lineimage: "" },
      { id: 26, driverfullname: "นาย ประสิทธิ์ รอดมาลัย", drivername: "ประสิทธิ์", surname: "รอดมาลัย", nickname: "", license: "", licensetype: "", phone: "082-5966591", mobile: "0825966591", linename: "", lineimage: "" },
      { id: 27, driverfullname: "นาย พนธกร น้อยหลา", drivername: "พนธกร", surname: "น้อยหลา", nickname: "", license: "", licensetype: "", phone: "091-0214170", mobile: "0910214170", linename: "", lineimage: "" },
      { id: 28, driverfullname: "นาย พิรุณ จันทคาด(ชั่วคราว)", drivername: "พิรุณ", surname: "จันทคาด", nickname: "", license: "", licensetype: "", phone: "094-7049925", mobile: "0947049925", linename: "", lineimage: "" },
      { id: 29, driverfullname: "นาย วิษณุกรณ์ วงษ์นอก", drivername: "วิษณุกรณ์", surname: "วงษ์นอก", nickname: "", license: "", licensetype: "", phone: "061-4295429", mobile: "0614295429", linename: "", lineimage: "" },
      { id: 30, driverfullname: "นาย ศรายุทธ ประกอบธรรม", drivername: "ศรายุทธ", surname: "ประกอบธรรม", nickname: "", license: "", licensetype: "", phone: "094-4065753", mobile: "0944065753", linename: "", lineimage: "" },
      { id: 31, driverfullname: "นาย ศักดิ์ดา พุ่มพวง", drivername: "ศักดิ์ดา", surname: "พุ่มพวง", nickname: "", license: "", licensetype: "", phone: "089-4061388", mobile: "0894061388", linename: "", lineimage: "" },
      { id: 32, driverfullname: "นาย สมชาย รอบคอนครบุรี", drivername: "สมชาย", surname: "รอบคอนครบุรี", nickname: "", license: "", licensetype: "", phone: "086-6610085", mobile: "0866610085", linename: "", lineimage: "" },
      { id: 33, driverfullname: "นาย สรพงศ์ แก้วสว่าง", drivername: "สรพงศ์", surname: "แก้วสว่าง", nickname: "", license: "", licensetype: "", phone: "096-7315929", mobile: "0967315929", linename: "", lineimage: "" },
      { id: 34, driverfullname: "นาย สำเร็จ สุขมูล", drivername: "สำเร็จ", surname: "สุขมูล", nickname: "", license: "", licensetype: "", phone: "063-3325851", mobile: "0633325851", linename: "", lineimage: "" },
      { id: 35, driverfullname: "นาย เตียง โพธิขาว", drivername: "เตียง", surname: "โพธิขาว", nickname: "", license: "", licensetype: "", phone: "065-9283807", mobile: "0659283807", linename: "", lineimage: "" },
      { id: 36, driverfullname: "นุกูล  จันทรโกมล", drivername: "นุกูล", surname: "จันทรโกมล", nickname: "", license: "", licensetype: "", phone: "091-7466225", mobile: "0917466225", linename: "", lineimage: "" },
      { id: 37, driverfullname: "บุญส่ง อันภักดี", drivername: "บุญส่ง", surname: "อันภักดี", nickname: "", license: "", licensetype: "", phone: "082-8572630", mobile: "0828572630", linename: "", lineimage: "" },
      { id: 38, driverfullname: "บุบผารัง 061-484-4995", drivername: "จรัญ", surname: "บุบผารัง", nickname: "", license: "", licensetype: "", phone: "061-484-4995", mobile: "0614844995", linename: "", lineimage: "" },
      { id: 39, driverfullname: "บุ่งหวาย 061-665-8808", drivername: "ชาตี", surname: "บุ่งหวาย", nickname: "", license: "", licensetype: "", phone: "061-665-8808", mobile: "0616658808", linename: "", lineimage: "" },
      { id: 40, driverfullname: "ประกาศ ผาพรม", drivername: "ประกาศ", surname: "ผาพรม", nickname: "", license: "", licensetype: "", phone: "081-4792382", mobile: "0814792382", linename: "", lineimage: "" },
      { id: 41, driverfullname: "พรมงาม 094-838-6849", drivername: "เกียรติชัย", surname: "พรมงาม", nickname: "", license: "", licensetype: "", phone: "094-838-6849", mobile: "0948386849", linename: "", lineimage: "" },
      { id: 42, driverfullname: "พล นพเทา", drivername: "พล", surname: "นพเทา", nickname: "", license: "", licensetype: "", phone: "063-660-6050", mobile: "0636606050", linename: "", lineimage: "" },
      { id: 43, driverfullname: "พลเสน 061-517-1914", drivername: "ธวัชชัย", surname: "พลเสน", nickname: "", license: "", licensetype: "", phone: "061-517-1914", mobile: "0615171914", linename: "", lineimage: "" },
      { id: 44, driverfullname: "พิเชษฐ์ ทัพอินทร์", drivername: "พิเชษฐ์", surname: "ทัพอินทร์", nickname: "", license: "", licensetype: "", phone: "081-4449525", mobile: "0814449525", linename: "", lineimage: "" },
      { id: 45, driverfullname: "พุกเนียม 091-823-7158", drivername: "ขรรค์ชัย", surname: "พุกเนียม", nickname: "", license: "", licensetype: "", phone: "091-823-7158", mobile: "0918237158", linename: "", lineimage: "" },
      { id: 46, driverfullname: "พุ่มเกศรี 064-463-6682", drivername: "สนธยา", surname: "พุ่มเกศรี", nickname: "", license: "", licensetype: "", phone: "064-463-6682", mobile: "0644636682", linename: "", lineimage: "" },
      { id: 47, driverfullname: "มณีศรี 080-393-5161", drivername: "ปิยะพงษ์", surname: "มณีศรี", nickname: "", license: "", licensetype: "", phone: "080-393-5161", mobile: "0803935161", linename: "", lineimage: "" },
      { id: 48, driverfullname: "มนตรี ใจอดทน", drivername: "มนตรี", surname: "ใจอดทน", nickname: "", license: "", licensetype: "", phone: "093-695-9166", mobile: "0936959166", linename: "", lineimage: "" },
      { id: 49, driverfullname: "มหาธิโคตร  090-269-4410", drivername: "สนอง", surname: "มหาธิโคตร", nickname: "", license: "", licensetype: "", phone: " 090-269-4410", mobile: " 0902694410", linename: "", lineimage: "" },
      { id: 50, driverfullname: "มัชฌิมา  บัวบุตร", drivername: "มัชฌิมา", surname: "บัวบุตร", nickname: "", license: "", licensetype: "", phone: "084-9574819", mobile: "0849574819", linename: "", lineimage: "" },
      { id: 51, driverfullname: "รัตนภรณ์ ปลอดแก้ว", drivername: "รัตนภรณ์", surname: "ปลอดแก้ว", nickname: "", license: "", licensetype: "", phone: "065-0397232", mobile: "0650397232", linename: "", lineimage: "" },
      { id: 52, driverfullname: "รัตนา  ขันตี", drivername: "รัตนา", surname: "ขันตี", nickname: "", license: "", licensetype: "", phone: "098-4913510", mobile: "0984913510", linename: "", lineimage: "" },
      { id: 53, driverfullname: "รุ่งนภา อุดมถาวรสิน", drivername: "รุ่งนภา", surname: "อุดมถาวรสิน", nickname: "", license: "", licensetype: "", phone: "082-3946994", mobile: "0823946994", linename: "", lineimage: "" },
      { id: 54, driverfullname: "วงศ์สง่า 062-307-6423", drivername: "ถนอม", surname: "วงศ์สง่า", nickname: "", license: "", licensetype: "", phone: "062-307-6423", mobile: "0623076423", linename: "", lineimage: "" },
      { id: 55, driverfullname: "วรรณะ พาชีชีพ", drivername: "วรรณะ", surname: "พาชีชีพ", nickname: "", license: "", licensetype: "", phone: "098-6595133", mobile: "0986595133", linename: "", lineimage: "" },
      { id: 56, driverfullname: "วันชัย  สุวรรณโน", drivername: "วันชัย", surname: "สุวรรณโน", nickname: "", license: "", licensetype: "", phone: "098-4564234", mobile: "0984564234", linename: "", lineimage: "" },
      { id: 57, driverfullname: "วัลภูมิ 087-483-0301", drivername: "สรัช", surname: "วัลภูมิ", nickname: "", license: "", licensetype: "", phone: "087-483-0301", mobile: "0874830301", linename: "", lineimage: "" },
      { id: 58, driverfullname: "วิษณุ เรืองฉาย", drivername: "วิษณุ", surname: "เรืองฉาย", nickname: "", license: "", licensetype: "", phone: "065-509-7034", mobile: "0655097034", linename: "", lineimage: "" },
      { id: 59, driverfullname: "วีระพล มีขำ", drivername: "วีระพล", surname: "มีขำ", nickname: "", license: "", licensetype: "", phone: "080-393-5161", mobile: "0803935161", linename: "", lineimage: "" },
      { id: 60, driverfullname: "ศักรินทร์ ชื่นกมล", drivername: "ศักรินทร์", surname: "ชื่นกมล", nickname: "", license: "", licensetype: "", phone: "094-9592812", mobile: "0949592812", linename: "", lineimage: "" },
      { id: 61, driverfullname: "สงวนศักดิ์ บุตรวารินทร์", drivername: "สงวนศักดิ์", surname: "บุตรวารินทร์", nickname: "", license: "", licensetype: "", phone: "086-8381123", mobile: "0868381123", linename: "", lineimage: "" },
      { id: 62, driverfullname: "สมศักดิ์ พิมพ์สอน", drivername: "สมศักดิ์", surname: "พิมพ์สอน", nickname: "", license: "", licensetype: "", phone: "064-7179950", mobile: "0647179950", linename: "", lineimage: "" },
      { id: 63, driverfullname: "สมหมาย เทพวรส", drivername: "สมหมาย", surname: "เทพวรส", nickname: "", license: "", licensetype: "", phone: "099-1528061", mobile: "0991528061", linename: "", lineimage: "" },
      { id: 64, driverfullname: "สมเกียรติ บุญชอบ", drivername: "สมเกียรติ", surname: "บุญชอบ", nickname: "", license: "", licensetype: "", phone: "095-0744112", mobile: "0950744112", linename: "", lineimage: "" },
      { id: 65, driverfullname: "สิงชัย 098-826-1037", drivername: "จตุรพล", surname: "สิงชัย", nickname: "", license: "", licensetype: "", phone: "098-826-1037", mobile: "0988261037", linename: "", lineimage: "" },
      { id: 66, driverfullname: "สีสันงาม 092-707-2838", drivername: "กิตติศักดิ์", surname: "สีสันงาม", nickname: "", license: "", licensetype: "", phone: "092-707-2838", mobile: "0927072838", linename: "", lineimage: "" },
      { id: 67, driverfullname: "สุกฤษฏ์  สมาณสินธ์", drivername: "สุกฤษฏ์", surname: "สมาณสินธ์", nickname: "", license: "", licensetype: "", phone: "063-5494939", mobile: "0635494939", linename: "", lineimage: "" },
      { id: 68, driverfullname: "สุขอู๊ด 061-849-7300", drivername: "สุนันทา", surname: "สุขอู๊ด", nickname: "", license: "", licensetype: "", phone: "061-849-7300", mobile: "0618497300", linename: "", lineimage: "" },
      { id: 69, driverfullname: "สุขเย็น 094-351-5935", drivername: "กิตติเดช", surname: "สุขเย็น", nickname: "", license: "", licensetype: "", phone: "094-351-5935", mobile: "0943515935", linename: "", lineimage: "" },
      { id: 70, driverfullname: "สุทัศ  ว่องไว", drivername: "สุทัศ", surname: "ว่องไว", nickname: "", license: "", licensetype: "", phone: "082-0505762", mobile: "0820505762", linename: "", lineimage: "" },
      { id: 71, driverfullname: "สุปัญญา 094-514-1456", drivername: "บุญจันทร์", surname: "สุปัญญา", nickname: "", license: "", licensetype: "", phone: "094-514-1456", mobile: "0945141456", linename: "", lineimage: "" },
      { id: 72, driverfullname: "สุรพล ทองชุม", drivername: "สุรพล", surname: "ทองชุม", nickname: "", license: "", licensetype: "", phone: "098-189-1546", mobile: "0981891546", linename: "", lineimage: "" },
      { id: 73, driverfullname: "สุรเชษฐ บัวผัน", drivername: "สุรเชษฐ", surname: "บัวผัน", nickname: "", license: "", licensetype: "", phone: "092-876-8838", mobile: "0928768838", linename: "", lineimage: "" },
      { id: 74, driverfullname: "หามนตรี 081-973-3746", drivername: "นิเรศ", surname: "หามนตรี", nickname: "", license: "", licensetype: "", phone: "081-973-3746", mobile: "0819733746", linename: "", lineimage: "" },
      { id: 75, driverfullname: "อนันท์  คำดำ", drivername: "อนันท์", surname: "คำดำ", nickname: "", license: "", licensetype: "", phone: "089-2457429", mobile: "0892457429", linename: "", lineimage: "" },
      { id: 76, driverfullname: "อภิชาติ  เกิดบ้านเป้า", drivername: "อภิชาติ", surname: "เกิดบ้านเป้า", nickname: "", license: "", licensetype: "", phone: "062-3963668", mobile: "0623963668", linename: "", lineimage: "" },
      { id: 77, driverfullname: "อรุณ หำศิริ", drivername: "อรุณ", surname: "หำศิริ", nickname: "", license: "", licensetype: "", phone: "062-9911570", mobile: "0629911570", linename: "", lineimage: "" },
      { id: 78, driverfullname: "อาจสมดี 061-689-2910", drivername: "สมบัติ", surname: "อาจสมดี", nickname: "", license: "", licensetype: "", phone: "061-689-2910", mobile: "0616892910", linename: "", lineimage: "" },
      { id: 79, driverfullname: "อำนาจ  พระนา", drivername: "อำนาจ", surname: "พระนา", nickname: "", license: "", licensetype: "", phone: "096-8827729", mobile: "0968827729", linename: "", lineimage: "" },
      { id: 80, driverfullname: "อิงคปกรณ์ 094-283-6403", drivername: "วิทยา", surname: "อิงคปกรณ์", nickname: "", license: "", licensetype: "", phone: "094-283-6403", mobile: "0942836403", linename: "", lineimage: "" },
      { id: 81, driverfullname: "อุทัย พิมสาร", drivername: "อุทัย", surname: "พิมสาร", nickname: "", license: "", licensetype: "", phone: "098-450-3869", mobile: "0984503869", linename: "", lineimage: "" },
      { id: 82, driverfullname: "เกษม  บุตรพรม", drivername: "เกษม", surname: "บุตรพรม", nickname: "", license: "", licensetype: "", phone: "095-8085275", mobile: "0958085275", linename: "", lineimage: "" },
      { id: 83, driverfullname: "เขียวสด 064-550-4545", drivername: "ชอบชัย", surname: "เขียวสด", nickname: "", license: "", licensetype: "", phone: "064-550-4545", mobile: "0645504545", linename: "", lineimage: "" },
      { id: 84, driverfullname: "เด่นดวง ปากกาบุตร", drivername: "เด่นดวง", surname: "ปากกาบุตร", nickname: "", license: "", licensetype: "", phone: "087-5574628", mobile: "0875574628", linename: "", lineimage: "" },
      { id: 85, driverfullname: "เทพ  จันทรลูน", drivername: "เทพ", surname: "จันทรลูน", nickname: "", license: "", licensetype: "", phone: "062-4590932", mobile: "0624590932", linename: "", lineimage: "" },
      { id: 86, driverfullname: "เสกสรร เมมารี", drivername: "เสกสรร", surname: "เมมารี", nickname: "", license: "", licensetype: "", phone: "081-723-8679", mobile: "0817238679", linename: "", lineimage: "" },
      { id: 87, driverfullname: "เอกพงษ์ หุมอาจ", drivername: "เอกพงษ์", surname: "หุมอาจ", nickname: "", license: "", licensetype: "", phone: "081-4359261", mobile: "0814359261", linename: "", lineimage: "" },
      { id: 88, driverfullname: "แก้วเกตุ 092-563-5217", drivername: "ณัฐพงษ์", surname: "แก้วเกตุ", nickname: "", license: "", licensetype: "", phone: "092-563-5217", mobile: "0925635217", linename: "", lineimage: "" },
      { id: 89, driverfullname: "แจ้งจันทร์ 084-168-1944", drivername: "สุระเดช", surname: "แจ้งจันทร์", nickname: "", license: "", licensetype: "", phone: "084-168-1944", mobile: "0841681944", linename: "", lineimage: "" },
      { id: 90, driverfullname: "โนนกงกลาง 081-283-0061", drivername: "ณรงค์", surname: "โนนกงกลาง", nickname: "", license: "", licensetype: "", phone: "081-283-0061", mobile: "0812830061", linename: "", lineimage: "" },
      { id: 91, driverfullname: "โยธา  ศรีปัญญา", drivername: "โยธา", surname: "ศรีปัญญา", nickname: "", license: "", licensetype: "", phone: "087-9555890", mobile: "0879555890", linename: "", lineimage: "" },
      { id: 92, driverfullname: "ไพรินทร์ ไกรสิทธิ์", drivername: "ไพรินทร์", surname: "ไกรสิทธิ์", nickname: "", license: "", licensetype: "", phone: "062-6106810", mobile: "0626106810", linename: "", lineimage: "" }
    ]
  }



  openDialog(row: any) {

  }

  viewDriver(type: any) {

    if (type == "viewlist") {
      this.viewtype = true;
    }
    else {
      this.viewtype = false;
    }
  }


  newDriver(modal: any) {
    // this.activedata = new 
    this.modalService.open(modal, { fullscreen: true, scrollable: true });
  }

  showDriver(data: any, modal: any) {
    this.activedata = data;
    this.modalService.open(modal, { fullscreen: true, scrollable: true });
  }

  talkbackdata(event: any) {

  }

}

export interface DriverModel {
  id: number;
  driverfullname: string;
  drivername: string;
  surname: string;
  nickname: string;
  license: string;
  licensetype: string;
  phone: string;
  mobile: string;
  linename: string;
  lineimage: string;
}

