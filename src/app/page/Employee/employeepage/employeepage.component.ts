import { Component,Input,EventEmitter, Output, OnInit   } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {EmployeeModel} from '../../../models/datamodule.module'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';

@Component({
  selector: 'app-employeepage',
  templateUrl: './employeepage.component.html',
  styleUrls: ['./employeepage.component.scss']
})
export class EmployeepageComponent implements OnInit {
  @Input() modal: any;
  @Input() activedata : EmployeeModel = new EmployeeModel();
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
