import { StoredData } from '../../../shared/models/stored-data';
import { Difficulty } from './difficulty.model';

export class DefaultGameData {
  private data: StoredData;
  private difficulties = Difficulty.getDifficulties();

  constructor() {
    this.data = new StoredData(`minesweeper-default`);
  }

  public get lastDifficulty(): Difficulty {
    const value = this.data.get('lastDifficulty') as string;
    const difficulty = this.difficulties.find(x => x.name === value);
    return difficulty ? difficulty : this.difficulties[0];
  }

  public set lastDifficulty(newValue: Difficulty) {
    this.data.set('lastDifficulty', newValue.name);
  }

  public get customX(): number {
    const value = this.data.get('customX');
    return value ? +value : 0;
  }

  public set customX(newValue: number) {
    this.data.set('customX', newValue);
  }

  public get customY(): number {
    const value = this.data.get('customY');
    return value ? +value : 0;
  }

  public set customY(newValue: number) {
    this.data.set('customY', newValue);
  }

  public get customMines(): number {
    const value = this.data.get('customMines');
    return value ? +value : 0;
  }

  public set customMines(newValue: number) {
    this.data.set('customMines', newValue);
  }
}
