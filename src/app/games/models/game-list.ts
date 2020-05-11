import { GameEntry } from './game-entry';
import { MinesweeperComponent } from '../minesweeper/minesweeper.component';
import { CardsComponent } from '../cards/cards.component';

export class GameList {
  public static readonly instance = new GameList();

  public games: GameEntry[] = [];
  private constructor() {
    this.games.push(MinesweeperComponent.getGameEntry());
    this.games.push(CardsComponent.getGameEntry());
  }
}
