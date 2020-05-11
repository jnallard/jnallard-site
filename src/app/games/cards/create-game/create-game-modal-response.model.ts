import { CardCastDeck } from 'src/server/games/cards/dtos/card-cast-deck';

export class CreateGameModalResponse {
  constructor(public name: string, public selectedDecks: CardCastDeck[]) {}
}
