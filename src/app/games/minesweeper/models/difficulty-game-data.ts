
import { StoredData } from '../../../shared/models/stored-data';

export class DifficultyGameData extends StoredData {
  constructor(difficulty: string) {
    super(`minesweeper-${difficulty}`);
  }

  public get wins(): number {
    const value = this.get('wins');
    return value ? +value : 0;
  }

  public set wins(newValue: number) {
    this.set('wins', newValue);
  }

  public get attempts(): number {
    const value = this.get('attempts');
    return value ? +value : 0;
  }

  public set attempts(newValue: number) {
    this.set('attempts', newValue);
  }

  public get autoReveals(): number {
    const value = this.get('autoReveals');
    return value ? +value : 0;
  }

  public set autoReveals(newValue: number) {
    this.set('autoReveals', newValue);
  }

  public get autoRevealsUsed(): number {
    const value = this.get('autoRevealsUsed');
    return value ? +value : 0;
  }

  public set autoRevealsUsed(newValue: number) {
    this.set('autoRevealsUsed', newValue);
  }

  public get bestTimeMilliseconds(): number {
    const value = this.get('bestTimeMilliseconds');
    return value ? +value : 0;
  }

  public set bestTimeMilliseconds(newValue: number) {
    this.set('bestTimeMilliseconds', newValue);
  }
}
