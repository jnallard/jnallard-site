import { CardCastDeck } from 'src/server/games/cards/dtos/card-cast-deck';

export class CreateGameModalRequest {
  constructor(public knownDecks: CardCastDeck[]) {}
}
