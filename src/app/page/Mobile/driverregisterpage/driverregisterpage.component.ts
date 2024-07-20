import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driverregisterpage',
  templateUrl: './driverregisterpage.component.html',
  styleUrls: ['./driverregisterpage.component.scss']
})
export class DriverregisterpageComponent implements OnInit{
  ShowRegister:boolean = false;
  ngOnInit(): void {
  
  }
  linelogin_Click(){
   this.ShowRegister = !this.ShowRegister;
  }

  register_Click(){
    
  }
  
}
