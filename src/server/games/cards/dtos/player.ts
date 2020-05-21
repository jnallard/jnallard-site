import { PlayerStatus } from './player-status';

export class Player {
  constructor(public name: string, public score: number, public status: PlayerStatus) {
  }
}
