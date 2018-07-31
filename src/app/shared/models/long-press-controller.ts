import { PressEvent } from './press-event';

export class PressController {

  public onPress: ($event: PressEvent) => void = () => {};
  public onDoublePress: ($event: PressEvent) => void = () => {};
  public onLongPress: ($event: PressEvent) => void = () => {};

  constructor() {
  }
}
