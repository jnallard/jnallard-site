export class CreateGameRequest {
  constructor(public name: string, public deckIds: string[]) {}
}
