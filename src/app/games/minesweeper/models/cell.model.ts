import { Canvas } from './canvas.model';
import { Color } from './color.enum';
import { GameLostException } from './GameOverException.model';

export class Cell {
  public static readonly width: number = 35;
  public static readonly height: number = 35;

  public hasMine = false;
  public neighborMineCount = 0;

  public searched = false;
  public flagged = false;

  private isGameOver = false;
  private isGameWon = false;

  constructor(public readonly x: number,
    public readonly y: number,
    public readonly key: string) {

  }

  public draw() {
    const context = Canvas.instance.context2D;
    const xPos = Cell.width * this.x;
    const yPos = Cell.height * this.y;
    context.clearRect(xPos, yPos, Cell.width, Cell.height);
    context.beginPath();
    context.rect(xPos, yPos, Cell.width, Cell.height);
    context.fillStyle = this.getCellColor();
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.font = '20px Georgia';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    if (this.flagged) {
      this.drawText('f', Color.Flag);
    } else if (this.searched && this.hasMine) {
      this.drawText('X', Color.Mine);
    } else if (this.searched && this.neighborMineCount > 0) {
      this.drawText(this.neighborMineCount.toString(), this.getTextColorForNeighborMineCount());
    }
    context.stroke();
  }

  public reveal() {
    if ( this.flagged ) { return; }
    this.searched = true;
    this.draw();
    if (this.hasMine) {
      throw new GameLostException('You revealed a mine. Game over!');
    }
  }

  public revealGameDone(success = true) {
    if (this.hasMine) {
      this.searched = true;
    }

    this.isGameOver = true;
    this.isGameWon = success;
    this.draw();
  }

  public flag() {
    if (this.searched) { return; }

    this.flagged = !this.flagged;
    this.draw();
  }

  private drawText(text: string, textColor: Color) {
    const xPos = Cell.width * this.x + Math.floor(Cell.width / 2);
    const yPos = Cell.height * this.y + Math.floor(Cell.height / 2);
    const context = Canvas.instance.context2D;
    context.fillStyle = textColor;
    Canvas.instance.context2D.fillText(text, xPos, yPos);
  }

  private getTextColorForNeighborMineCount() {
    switch (this.neighborMineCount) {
      default:
        return Color.One;
    }
  }

  private getCellColor() {

    if (!this.searched) {
      return this.isGameOver ?
        (this.isGameWon ?
          Color.UnsearchedWon
          : Color.UnsearchedLost)
        : Color.Unsearched;
    }

    if (this.hasMine) {
      return this.isGameOver ?
        (this.isGameWon ?
          Color.SearchedAndMineWon
          : Color.SearchedAndMineLost)
        : Color.SearchedAndMine;
    }

    if (this.neighborMineCount === 0) {
      return this.isGameOver ?
        (this.isGameWon ?
          Color.SearchedAndSafeWon
          : Color.SearchedAndSafeLost)
        : Color.SearchedAndSafe;
    }

    return this.isGameOver ?
    (this.isGameWon ?
      Color.SearchedWon
      : Color.SearchedLost)
    : Color.Searched;
  }
}
