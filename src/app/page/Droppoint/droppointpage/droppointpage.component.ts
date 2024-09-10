import { Component,Input,EventEmitter, Output, OnInit   } from '@angular/core';
import { NgbModalConfig,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Droppointdata} from '../../../models/datamodule.module'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';

@Component({
  selector: 'app-droppointpage',
  templateUrl: './droppointpage.component.html',
  styleUrls: ['./droppointpage.component.scss']
})

export class DroppointpageComponent implements OnInit {
  @Input() modal: any;
  @Input() activedata : Droppointdata = new Droppointdata();
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
