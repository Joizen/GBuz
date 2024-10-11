import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogpage',
  templateUrl: './dialogpage.component.html',
  styleUrls: ['./dialogpage.component.scss']
})
export class DialogpageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:DialogConfig ){}
}

export class DialogConfig {
  Header:string = "Header";
  Message:string = "Message";
  Ok:string="OK";
  Cancel:string="Cancel";
  Showok:boolean=true;
  Showcancel:boolean=false;

  constructor(header:string,message:string,showcancel=false,btncancel="Cancel",showok=true,btnok="OK") {
    this.Header = header;
    this.Message = message;
    this.Ok=btnok;
    this.Cancel=btncancel;
    this.Showok=showok;
    this.Showcancel=showcancel;
  }
}
