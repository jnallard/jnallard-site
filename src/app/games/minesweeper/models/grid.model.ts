import { Cell } from './cell.model';
import { Canvas } from './canvas.model';

export class Grid {
  private cells: { [key: string]: Cell; } = {};

  constructor(private x: number, private y: number, private mines: number) {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        const key = `${i}-${j}`;
        this.cells[key] = new Cell(i, j, key);
      }
    }
  }

  public draw(canvas: Canvas) {
    const equalWidth = canvas.htmlCanvas.width / this.x;
    const equalHeight = canvas.htmlCanvas.height / this.y;
    for (const cell of Object.values(this.cells)) {
      cell.draw(canvas, equalWidth, equalHeight);
    }
    canvas.context2D.stroke();
    canvas.htmlCanvas.onclick = (event: MouseEvent) => {
      console.log(event.layerX, canvas.htmlCanvas.width);
      console.log(canvas.htmlCanvas.width / equalWidth);
      console.log(event);
    };
  }
}
