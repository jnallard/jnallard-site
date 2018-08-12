
import { StoredData } from '../../../shared/models/stored-data';

export class DifficultyGameData {
  private data: StoredData;
  constructor(difficulty: string) {
    this.data = new StoredData(`minesweeper-${difficulty}`);
  }

  public get wins(): number {
    const value = this.data.get('wins');
    return value ? +value : 0;
  }

  public set wins(newValue: number) {
    this.data.set('wins', newValue);
  }

  public get attempts(): number {
    const value = this.data.get('attempts');
    return value ? +value : 0;
  }

  public set attempts(newValue: number) {
    this.data.set('attempts', newValue);
  }

  public get autoReveals(): number {
    const value = this.data.get('autoReveals');
    return value ? +value : 0;
  }

  public set autoReveals(newValue: number) {
    this.data.set('autoReveals', newValue);
  }

  public get autoRevealsUsed(): number {
    const value = this.data.get('autoRevealsUsed');
    return value ? +value : 0;
  }

  public set autoRevealsUsed(newValue: number) {
    this.data.set('autoRevealsUsed', newValue);
  }

  public get bestTimeMilliseconds(): number {
    const value = this.data.get('bestTimeMilliseconds');
    return value ? +value : 0;
  }

  public set bestTimeMilliseconds(newValue: number) {
    this.data.set('bestTimeMilliseconds', newValue);
  }
}
