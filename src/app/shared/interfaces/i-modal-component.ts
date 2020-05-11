import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export interface IModalComponent<In, Out> {
  init(modalRef: NgbModalRef, data: In): void;
  getResult(): Out;
}
