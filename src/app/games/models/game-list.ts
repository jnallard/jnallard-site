import { GameEntry } from './game-entry';
import { MinesweeperComponent } from '../minesweeper/minesweeper.component';
import { CardsComponent } from '../cards/cards.component';
import { RpgComponent } from '../rpg/rpg.component';

export class GameList {
  public static readonly instance = new GameList();

  public games: GameEntry[] = [];
  private constructor() {
    this.games = [
      MinesweeperComponent.getGameEntry(),
      CardsComponent.getGameEntry(),
      RpgComponent.getGameEntry(),
    ].sort((a, b) => a.name.localeCompare(b.name));
  }
}
