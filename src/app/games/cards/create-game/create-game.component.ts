import { Component, OnInit } from '@angular/core';
import { IModalComponent } from 'src/app/shared/interfaces/i-modal-component';
import { CardCastDeck } from 'src/server/games/cards/dtos/card-cast-deck';
import { CreateGameModalRequest } from './create-game-modal-request.model';
import { CreateGameModalResponse } from './create-game-modal-response.model';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit, IModalComponent<CreateGameModalRequest, CreateGameModalResponse> {

  public knownDecks: {selected: boolean, deck: CardCastDeck}[];
  public modalRef: NgbModalRef;
  public name: string;

  init(modalRef: NgbModalRef, data: CreateGameModalRequest) {
    this.modalRef = modalRef;
    this.knownDecks = data.knownDecks.map(deck => {
      return {selected: false, deck};
    });
  }

  getResult() {
    return new CreateGameModalResponse(this.name, this.getSelectedDecks().map(deck => deck.deck));
  }

  constructor() { }

  ngOnInit(): void {
  }

  getSelectedDecks() {
    return this.knownDecks.filter(deck => deck.selected);
  }
}
