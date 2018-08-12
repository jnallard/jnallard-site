import { Canvas } from './canvas.model';
import { Color } from './color.enum';
import { GameLostException } from './game-over-exception';

export class Cell {
  public static readonly width: number = 35;
  public static readonly height: number = 35;

  public hasMine = false;
  public neighborMineCount = 0;

  public searched = false;
  public flagged = false;

  public readonly sortingValue = Math.random();

  private isGameOver = false;
  private isGameWon = false;
  private isHighlighted = false;

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
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    if (this.flagged) {
      this.drawText('\uf11e', Color.Flag, true);
    } else if (this.searched && this.hasMine) {
      this.drawText('\uf1e2', Color.Mine, true);
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

  public setHighlighted(isHighlighted: boolean = true) {
    this.isHighlighted = isHighlighted;
    this.draw();
  }

  private drawText(text: string, textColor: Color, useFontAwesome: boolean = false) {

    const xPos = Cell.width * this.x + Math.floor(Cell.width / 2);
    const yPos = Cell.height * this.y + Math.floor(Cell.height / 2);
    const context = Canvas.instance.context2D;
    context.fillStyle = textColor;
    context.font = useFontAwesome ? '900 24px "Font Awesome 5 Free"' : '500 24px "Arial"';
    Canvas.instance.context2D.fillText(text, xPos, yPos);
  }

  private getTextColorForNeighborMineCount() {
    switch (this.neighborMineCount) {
      default:
        return Color.One;
      case 2:
        return Color.Two;
      case 3:
        return Color.Three;
      case 4:
        return Color.Four;
      case 5:
        return Color.Five;
      case 6:
        return Color.Six;
      case 7:
        return Color.Seven;
      case 8:
        return Color.Eight;
    }
  }

  private getCellColor() {
    if (this.isHighlighted) {
      return this.searched ?
        Color.HighlightedSearched
        : Color.HighlightedUnsearched;
    }

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
