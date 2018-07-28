export class Canvas {
  public context2D: CanvasRenderingContext2D;
  constructor(public htmlCanvas: HTMLCanvasElement) {
    this.context2D = htmlCanvas.getContext('2d');
  }
}
