import { Component, Input, OnInit, Output, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import {ModalService} from "src/app/services/modal.service/modal.service"
@Component({
  selector: 'confirmn-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmnDialogComponent implements OnInit, OnChanges {

  constructor(private modalService:ModalService) { }

  ngOnInit(): void {
    this.modalService.status.subscribe(data=>{
      this.displayStyle = data
      console.log(data)
    })
  }

  displayStyle:string = "block";
  
  openPopup() {
    // this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  }

