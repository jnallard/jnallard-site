import { StoredData } from '../../../shared/models/stored-data';
import { Difficulty } from './difficulty.model';

export class DefaultGameData extends StoredData {
  private difficulties = Difficulty.getDifficulties();

  constructor() {
    super(`minesweeper-default`);
  }

  public get lastDifficulty(): Difficulty {
    const value = this.get('lastDifficulty') as string;
    const difficulty = this.difficulties.find(x => x.name === value);
    return difficulty ? difficulty : this.difficulties[0];
  }

  public set lastDifficulty(newValue: Difficulty) {
    this.set('lastDifficulty', newValue.name);
  }

  public get customX(): number {
    const value = this.get('customX');
    return value ? +value : 0;
  }

  public set customX(newValue: number) {
    this.set('customX', newValue);
  }

  public get customY(): number {
    const value = this.get('customY');
    return value ? +value : 0;
  }

  public set customY(newValue: number) {
    this.set('customY', newValue);
  }

  public get customMines(): number {
    const value = this.get('customMines');
    return value ? +value : 0;
  }

  public set customMines(newValue: number) {
    this.set('customMines', newValue);
  }
}
