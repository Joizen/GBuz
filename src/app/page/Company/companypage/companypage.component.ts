import { Component,Input,EventEmitter, Output, OnInit   } from '@angular/core';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Companydata} from '../../../models/datamodule.module'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';

@Component({
  selector: 'app-companypage',
  templateUrl: './companypage.component.html',
  styleUrls: ['./companypage.component.scss']
})

export class CompanypageComponent implements OnInit {
  @Input() modal: any;
  @Input() activecompany : Companydata = new Companydata();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private modalService: NgbModal,
    public va: variable,
    private dialog: MatDialog,
    private snacbar: MatSnackBar
  ) {}
  show = {Spinner: true};
  ngOnInit(): void {
    this.show.Spinner=false;
    // console.log("Companypage ngOnInit activecompany",this.activecompany)
  }
}
