import { Cell } from './cell.model';
import { Canvas } from './canvas.model';
import { PressEvent } from '../../../shared/models/press-event';
import { PressType } from '../../../shared/models/press-type';
import { PressButtonType } from '../../../shared/models/press-button-type';

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

  public handlePressEvent(event: PressEvent) {
    const cell = this.getCellFromPixels(event.offsetX, event.offsetY);

    if (event.type === PressType.HoldingStarted) {
      if (cell.searched) {
        this.getNeighborCells(cell).forEach(x => x.setHighlighted());
      } else {
        cell.setHighlighted();
      }
    } else if (event.type === PressType.HoldingEnded) {
      this.getAllCells().forEach(x => x.setHighlighted(false));
    } else if (event.type === PressType.Single) {
      if (event.button === PressButtonType.Left) {
        this.revealCell(cell);
      } else if (event.button === PressButtonType.Middle) {
        this.revealNeighborCells(cell);
      } else if (event.button === PressButtonType.Right) {
        this.flagCell(cell);
      }
    } else if (event.type === PressType.Double) {
      this.revealNeighborCells(cell);
    } else if (event.type === PressType.Long) {
      if (cell.searched) {
        this.revealNeighborCells(cell);
      } else {
        this.flagCell(cell);
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

  public revealGameDone(success: boolean) {
    this.getAllCells().forEach(cell => cell.revealGameDone(success));
  }

  public autoRevealFlag() {
    const mines = this.getAllCells().filter(x => x.hasMine && !x.flagged).sort((a, b) => a.sortingValue - b.sortingValue);
    if (mines.length > 0) {
      mines[0].flag();
    }
  }

  private revealCell(cell: Cell) {
    if (!this.initialized) {
      this.initializeGrid(cell);
    }

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
