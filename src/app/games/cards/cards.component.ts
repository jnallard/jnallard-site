import { Component, OnInit } from '@angular/core';
import { GameEntry } from '../models/game-entry';
import { Socket } from 'ngx-socket-io';
import { SocketEvent } from 'src/app/shared/models/socket-event';
import { SocketData } from 'src/app/shared/models/socket-data';
import { Game } from 'src/server/games/cards/dtos/game';
import { CardCastDeck } from 'src/server/games/cards/dtos/card-cast-deck';
import { CreateGameComponent } from './create-game/create-game.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { CreateGameModalRequest } from './create-game/create-game-modal-request.model';
import { CreateGameRequest } from 'src/server/games/cards/dtos/create-game-request';
import { PickUsernameComponent } from './pick-username/pick-username.component';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { JoinGameRequest } from 'src/server/games/cards/dtos/join-game-request';
import { interval } from 'rxjs';
import { Card } from 'src/server/games/cards/dtos/card';
import { Round } from 'src/server/games/cards/dtos/round';
import { Player } from 'src/server/games/cards/dtos/player';
import { PlayerStatus } from 'src/server/games/cards/dtos/player-status';
import { PlayerUpdate } from 'src/server/games/cards/dtos/player-update';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  private readonly usernameStorageKey = 'caj-username';
  public knownGames: Game[];
  public knownDecks: CardCastDeck[];
  public currentGame: Game;
  public username: string;
  public messages: {html: string, action?: () => void}[] = [];
  public players: Player[] = [];
  public PlayerStatus = PlayerStatus;
  public isHost = false;

  public currentRound: Round;
  public selectedRound: Round;
  public rounds: Round[];
  public whiteCards: Card[];
  public selectedWhiteCards: Card[];
  public czarChosenCards: Card[];
  public areCardsPlayed = false;
  public myStatus: PlayerStatus;

  public cardsAreEqual = Card.cardsAreEqual;

  constructor(
    private modalService: ModalService,
    private socket: Socket
  ) {
    this.socket.emit('event', new SocketEvent('games', 'cards', new SocketData('loaded')));
    this.socket.on('game-list', (gameList: Game[]) => {
      this.knownGames = gameList;
    });
    this.socket.on('known-decks', (knownDecks: CardCastDeck[]) => {
      this.knownDecks = knownDecks;
    });
    this.socket.on('game-created', (game: Game) => {
      this.joinGame(game);
    });
    this.socket.on('game-joined', (game: Game) => {
      this.currentGame = game;
    });
    this.socket.on('my-player-update', (update: PlayerUpdate) => {
      this.whiteCards = update.whiteCards;
      this.myStatus = update.state;
      this.selectedWhiteCards = [];
      this.isHost = update.isHost;
    });
    this.socket.on('players-update', (players: Player[]) => {
      this.players = players;
    });
    this.socket.on('all-rounds', (rounds: Round[]) => {
      this.rounds = rounds;
      rounds.filter(round => round.winner).forEach(round => this.addWinningCardsMessage(round));
    });
    this.socket.on('start-round', (round: Round) => {
      this.reset();
      this.currentRound = round;
      this.selectedRound = round;
      this.areCardsPlayed = false;
    });
    this.socket.on('judge-round', (round: Round) => {
      this.currentRound = round;
      this.selectedRound = round;
    });
    this.socket.on('end-round', (round: Round) => {
      this.currentRound = round;
      this.selectedRound = round;
      this.rounds.push(round);
      this.addWinningCardsMessage(round);
    });
    this.socket.on('message', (message: string) => {
      this.messages.unshift({ html: message });
    });
    interval(1000).subscribe(() => this.sendEvent('request-reload', null));
  }

  public static getGameEntry() {
    return new GameEntry('Cards Against Josh',
      'cards',
      'Play this rip off of a game where you pick answers cards to play alongside prompt cards.',
      'placeholder.png',
      CardsComponent);
  }

  ngOnInit() {
    this.getUsername();
  }

  addWinningCardsMessage(round: Round) {
    let html = `<strong>${round.winner} won round ${round.roundNumber}.</strong> <small>(Click to view)</small><br/>`;
    const blackCardSplit = round.blackCard.displayText.split('_');
    const newArray = [] as string[];
    for (let i = 0; i < blackCardSplit.length; i++) {
      newArray.push(`${blackCardSplit[i].trim()} `);
      if (round.chosenCards[i]) {
        newArray.push(`<span class="white-text">${round.chosenCards[i].displayText.trim()}</span> `);
      }
    }
    html += `<p class="black-text">${newArray.join('')}</p>`;
    this.messages.unshift({ html, action: () => this.selectedRound = round });
  }

  isRoundDone() {
    return this.currentRound && this.currentRound.winner;
  }

  reset() {
    this.czarChosenCards = null;
    this.currentRound = null;
  }

  getUsername() {
    const storedUsername = localStorage.getItem(this.usernameStorageKey);
    if (storedUsername) {
      this.username = storedUsername;
      return;
    }

    this.modalService.open(PickUsernameComponent, null).subscribe(username => {
      this.username = username;
      localStorage.setItem(this.usernameStorageKey, username);
    });
  }

  changeUsername() {
    this.modalService.open(ConfirmationModalComponent, 'Are you sure you want to change your username?').subscribe(result => {
      if (result) {
        localStorage.removeItem(this.usernameStorageKey);
        this.username = null;
        this.getUsername();
      }
    });
  }

  leaveGame() {
    this.modalService.open(ConfirmationModalComponent, 'Are you sure you want to leave this game?').subscribe(result => {
      if (result) {
        this.currentGame = null;
        this.messages = [];
        this.sendEvent('leave-game');
      }
    });
  }

  createGame() {
    this.modalService.open(CreateGameComponent, new CreateGameModalRequest(this.knownDecks)).subscribe(data => {
      console.log(data);
      this.sendEvent('create-game', new CreateGameRequest(data.name, data.selectedDecks.map(deck => deck.id)));
    }, console.error);
  }

  joinGame(selectedGame: Game) {
    this.sendEvent('join-game', new JoinGameRequest(this.username, selectedGame.id));
  }

  sendEvent(eventType: string, data: any = null) {
    this.socket.emit('event', new SocketEvent('games', 'cards', new SocketData(eventType, data)));
  }

  toggleWhiteCard(whiteCard: Card) {
    if (this.selectedWhiteCards.includes(whiteCard)) {
      this.selectedWhiteCards.splice(this.selectedWhiteCards.indexOf(whiteCard), 1);
    } else {
      this.selectedWhiteCards.push(whiteCard);
    }
  }

  isCzar() {
    return this.myStatus === PlayerStatus.CardCzar;
  }

  canSubmitCards() {
    return this.currentRound.blackCard.underscores === this.selectedWhiteCards.length && !this.isRoundDone()
      && !this.areCardsPlayed && this.viewingCurrentRound();
  }

  canChooseWinningCards() {
    return this.czarChosenCards && !this.isRoundDone() && this.isCzar() && this.viewingCurrentRound();
  }

  playCards() {
    this.sendEvent('game.play-white-cards', this.selectedWhiteCards);
    this.areCardsPlayed = true;
  }

  pickWinningCards() {
    this.sendEvent('game.pick-winning-cards', this.czarChosenCards);
    this.czarChosenCards = null;
  }

  viewingCurrentRound() {
    return this.currentRound.roundNumber === this.selectedRound.roundNumber;
  }

  canSkipRound() {
    return !this.currentRound.winner;
  }

  skipRound() {
    this.sendEvent('game.force-round-end');
  }

  canForceReveal() {
    return this.players.some(p => p.status === PlayerStatus.Selecting) && this.players.some(p => p.status === PlayerStatus.Played);
  }

  forceReveal() {
    this.sendEvent('game.force-reveal');
  }
}
