import { Component, OnInit } from '@angular/core';
import { IModalComponent } from 'src/app/shared/interfaces/i-modal-component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pick-username',
  templateUrl: './pick-username.component.html',
  styleUrls: ['./pick-username.component.css']
})
export class PickUsernameComponent implements OnInit, IModalComponent<void, string> {
  public username: string;
  public modalRef: NgbModalRef;

  constructor() { }

  init(modalRef: NgbModalRef, data: void) {
    this.modalRef = modalRef;
  }

  getResult(): string {
    return this.username;
  }

  ngOnInit(): void {
  }

}
