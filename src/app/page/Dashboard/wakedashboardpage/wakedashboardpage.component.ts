import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';
import mqtt, { MqttClient } from 'mqtt';

@Component({
  selector: 'app-wakedashboardpage',
  templateUrl: './wakedashboardpage.component.html',
  styleUrls: ['./wakedashboardpage.component.scss']
})
export class WakedashboardpageComponent implements OnInit {
  constructor(public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar) { }
  async ngOnInit() {

  }
}
