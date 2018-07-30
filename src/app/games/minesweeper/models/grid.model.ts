import { Cell } from './cell.model';
import { Canvas } from './canvas.model';

export class Grid {

  private cells: { [key: string]: Cell; } = {};
  private initialized = false;

  constructor(public readonly columns: number, public readonly rows: number, public readonly mines: number) {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const key = this.getKey(i, j);
        this.cells[key] = new Cell(i, j, key);
      }
    }
  }

  public draw() {
    for (const cell of this.getAllCells()) {
      cell.draw();
    }
  }

  public isGameDone() {
    const unclearedCells = this.getAllCells().filter(cell => !(cell.searched && !cell.hasMine));
    return unclearedCells.length === this.mines;
  }

  public getUnflaggedMineCount() {
    return this.mines - this.getAllCells().filter(cell => cell.flagged).length;
  }

  public revealClick(event: MouseEvent) {
    const cell = this.getCellFromPixels(event.offsetX, event.offsetY);
    if (!this.initialized) {
      this.initializeGrid(cell);
    }
    this.revealCell(cell);
  }

  public flagClick(event: MouseEvent) {
    const cell = this.getCellFromPixels(event.offsetX, event.offsetY);
    this.flagCell(cell);
  }

  public revealNeighborsClick(event: MouseEvent) {
    const cell = this.getCellFromPixels(event.offsetX, event.offsetY);
    this.revealNeighborCells(cell);
  }

  public revealGameDone(success: boolean) {
    this.getAllCells().forEach(cell => cell.revealGameDone(success));
  }

  private revealCell(cell: Cell) {
    if (cell.searched || cell.flagged) {
      return;
    }

    cell.reveal();

    if (cell.neighborMineCount === 0) {
      this.getNeighborCells(cell).forEach(neighbor => this.revealCell(neighbor));
    }
  }

  private flagCell(cell: Cell) {
    if (this.initialized === false) {
      return;
    }

    cell.flag();
  }

  private revealNeighborCells(cell: Cell) {
    const neighbors = this.getNeighborCells(cell);
    if (cell.neighborMineCount === neighbors.filter(c => c.flagged).length) {
      neighbors.forEach(neighbor => this.revealCell(neighbor));
    }
  }

  private getAllCells() {
    return Object.values(this.cells);
  }

  private getKey(x: number, y: number) {
    return `${x}-${y}`;
  }

  private getCellFromPixels(xPixels: number, yPixels: number) {
    const x = Math.floor(xPixels / Cell.width);
    const y = Math.floor(yPixels / Cell.height);
    return this.cells[this.getKey(x, y)];
  }

  private getNeighborCells(targetCell: Cell) {
    return this.getAllCells().filter(cell => Math.abs(targetCell.x - cell.x) <= 1 && Math.abs(targetCell.y - cell.y) <= 1);
  }

  private initializeGrid(startingCell: Cell) {
    this.initialized = true;
    let mineCount = 0;
    while (mineCount < this.mines) {
      const x = Math.floor(Math.random() * this.columns);
      const y = Math.floor(Math.random() * this.rows);
      const cell = this.cells[this.getKey(x, y)];
      const neighbors = this.getNeighborCells(cell);
      if (!cell.hasMine && cell !== startingCell && !neighbors.includes(startingCell)) {
        cell.hasMine = true;
        neighbors.forEach(neighbor => neighbor.neighborMineCount++);
        mineCount++;
      }
    }
  }
}
