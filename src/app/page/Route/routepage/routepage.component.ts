import { Component,Input,EventEmitter, Output, OnInit   } from '@angular/core';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Routedata} from '../../../models/datamodule.module'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';

@Component({
  selector: 'app-routepage',
  templateUrl: './routepage.component.html',
  styleUrls: ['./routepage.component.scss']
})

export class RoutepageComponent implements OnInit {
  @Input() modal: any;
  @Input() activedata : Routedata = new Routedata();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) {}
  show = {Spinner: true};
  ngOnInit(): void {
    
  }
}
