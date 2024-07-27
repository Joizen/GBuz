import { Component , ChangeDetectionStrategy , OnInit , Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-driver-page',
  templateUrl: './driver-page.component.html',
  styleUrls: ['./driver-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPageComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<DriverPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  public driverData : DriverModel[] = [];

  ngOnInit(): void {
    this.setData();
  }

  setData(){
    this.driverData = [];
  }
}

export interface  DriverModel { 
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
