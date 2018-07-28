import { Canvas } from './canvas.model';

export class Cell {

  constructor(private x: number, private y: number, private key: string) {

  }

  public draw(canvas: Canvas, width: number, height: number) {
    const xPos = width * this.x;
    const yPos = height * this.y;
    canvas.context2D.rect(xPos, yPos, width, height);
  }
}
