import { GameEntry } from './game-entry';
import { MinesweeperComponent } from '../minesweeper/minesweeper.component';

export class GameList {
  public static readonly instance = new GameList();

  public games: GameEntry[] = [];
  private constructor() {
    this.games.push(MinesweeperComponent.getGameEntry());
  }
}
