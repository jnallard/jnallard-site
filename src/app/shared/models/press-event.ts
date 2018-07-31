import { PressType } from './press-type';
import { PressButtonType } from './press-button-type';

export class PressEvent {
  public readonly button: PressButtonType;
  public readonly offsetX: number;
  public readonly offsetY: number;

  public constructor(public readonly type: PressType, $event: {offsetX: number, offsetY: number, which: number}) {
    this.offsetX = $event.offsetX;
    this.offsetY = $event.offsetY;
    this.button = this.getButtonType($event.which);
  }

  private getButtonType(which: number) {
    switch (which) {
      default:
      case 1: return PressButtonType.Left;
      case 2: return PressButtonType.Middle;
      case 3: return PressButtonType.Right;
    }
  }
}
