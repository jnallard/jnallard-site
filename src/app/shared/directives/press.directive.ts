import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { PressEvent } from '../models/press-event';
import { PressType } from '../models/press-type';

@Directive({
  selector: '[appPress]'
})
export class PressDirective {
  @Output() appPress = new EventEmitter();

  private thisPress: number = new Date().getTime();
  private lastPress: number = new Date().getTime();

  private touchHoldStarted = false;

  private readonly LONG_PRESS_INTERVAL = 250;
  private readonly DOUBLE_PRESS_INTERVAL = 100;

  constructor() {

  }

  @HostListener('touchstart', ['$event'])
  onTouchStart($event: TouchEvent) {
    this.thisPress = new Date().getTime();
    this.touchHoldStarted = true;
    return;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd($event: TouchEvent) {
    $event.preventDefault();
    if (this.touchHoldStarted) {
      this.onPressEnd(this.convertTouchEvent($event));
    }
    this.touchHoldStarted = false;
    return;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove($event: TouchEvent) {
    this.touchHoldStarted = false;
    return;
  }

  @HostListener('mousedown', ['$event'])
  onPressStart($event: MouseEvent) {
    this.thisPress = new Date().getTime();
  }

  @HostListener('mouseup', ['$event'])
  onPressEnd($event: {offsetX: number, offsetY: number, which: number}) {
    if (this.lastPress && this.thisPress - this.lastPress < this.DOUBLE_PRESS_INTERVAL) {
      this.appPress.emit(new PressEvent(PressType.Double, $event));
    } else if (new Date().getTime() - this.thisPress > this.LONG_PRESS_INTERVAL) {
      this.appPress.emit(new PressEvent(PressType.Long, $event));
    } else {
      this.appPress.emit(new PressEvent(PressType.Single, $event));
    }
    this.lastPress = new Date().getTime();
  }

  private convertTouchEvent($event: TouchEvent) {
    const target = $event.target as HTMLElement;
    const bounds = target.getBoundingClientRect();
    return {
      offsetX: ($event.changedTouches[0].clientX - bounds.left),
      offsetY: ($event.changedTouches[0].clientY - bounds.top),
      which: 1
    };
  }

}
