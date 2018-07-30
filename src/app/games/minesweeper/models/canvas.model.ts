export class Canvas {
  public static readonly instance = new Canvas();

  public context2D: CanvasRenderingContext2D;
  public htmlCanvas: HTMLCanvasElement;

  private constructor() {}

  initialize(htmlCanvas: HTMLCanvasElement) {
    this.htmlCanvas = htmlCanvas;
    this.context2D = htmlCanvas.getContext('2d');
  }
}
