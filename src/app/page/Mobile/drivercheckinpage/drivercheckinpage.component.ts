import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-drivercheckinpage',
  templateUrl: './drivercheckinpage.component.html',
  styleUrls: ['./drivercheckinpage.component.scss']
})
export class DrivercheckinpageComponent implements OnInit {
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  
  }

  onCheckin_Click(){

  }
  open_Cancelmodule(modal:any){
    this.modalService.open(modal, { size: 'lg', scrollable: true });
  }
  autoGrowText(e:any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }
}
