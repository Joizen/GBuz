import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent implements OnInit{
  ShowRegister:boolean = false;
  ngOnInit(): void {
  
  }
  linelogin_Click(){
   this.ShowRegister = !this.ShowRegister;
  }

  register_Click(){
    
  }
  
}

