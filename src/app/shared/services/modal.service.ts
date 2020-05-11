import { Injectable, Type } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IModalComponent } from '../interfaces/i-modal-component';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private ngModal: NgbModal) { }

  open<In, Out>(a: Type<IModalComponent<In, Out>>, inData: In) {
    const modalRef = this.ngModal.open(a);
    const component = modalRef.componentInstance as IModalComponent<In, Out>;
    component.init(modalRef, inData);
    return from(modalRef.result)
    .pipe(
      map(() => component.getResult())
    );
  }
}
