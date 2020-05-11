import cardcast = require('cardcast');
import { from, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CardCastDeck } from './dtos/card-cast-deck';

export class CardCastWrapper {
  constructor() {}

  public getDeck(id: string) {
    let metadata: any;
    let blackCards: any[];
    let whiteCards: any[];
    const getInfo = from(cardcast(id).info() as Promise<any>)
      .pipe(tap(info => metadata = info));
    const getCalls = from(cardcast(id).calls() as Promise<any>)
      .pipe(tap(calls => blackCards = calls.map(card => card.text.join())));
    const getResponses = from(cardcast(id).responses() as Promise<any>)
      .pipe(tap(responses => whiteCards = responses.map(card => card.text.join())));
    return forkJoin(getInfo, getCalls, getResponses)
      .pipe(map(() => new CardCastDeck(metadata.name, metadata.code, blackCards, whiteCards)));
  }
}
