import { Component, OnInit } from '@angular/core';
import { IModalComponent } from '../../interfaces/i-modal-component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit, IModalComponent<string, boolean> {

  public prompt: string;
  public result: boolean;
  public modalRef: NgbModalRef;

  constructor() { }

  init(modalRef: NgbModalRef, data: string): void {
    this.modalRef = modalRef;
    this.prompt = data;
  }

  getResult(): boolean {
    return this.result;
  }

  ngOnInit(): void {
  }

}
