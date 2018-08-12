import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { PressEvent } from '../models/press-event';
import { PressType } from '../models/press-type';
import { interval, Subscription } from 'rxjs';
import { SourcePressEvent } from '../models/source-press-event';

@Directive({
  selector: '[appPress]'
})
export class PressDirective {
  @Output() appPress = new EventEmitter();

  private thisPress: number = new Date().getTime();
  private startingPress: SourcePressEvent = null;
  private pressInterrupted = true;
  private holdingNotification: Subscription = null;

  private readonly LONG_PRESS_INTERVAL = 250;
  private readonly MOVE_DISTANCE_BUFFER_PIXELS = 10;

  @HostListener('touchstart', ['$event'])
  onTouchStart($event: TouchEvent) {
    this.onPressStart(new SourcePressEvent($event, true, false));
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove($event: TouchEvent) {
    this.onPressMove(new SourcePressEvent($event, false, false));
  }

  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  @HostListener('touchleave', ['$event'])
  onTouchEnd($event: TouchEvent) {
    console.log($event);
    this.onPressEnd(new SourcePressEvent($event));
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown($event: MouseEvent) {
    this.onPressStart(new SourcePressEvent($event));
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent) {
    this.onPressMove(new SourcePressEvent($event, false, false));
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp($event: TouchEvent) {
    this.onPressEnd(new SourcePressEvent($event));
  }

  @HostListener('dblclick', ['$event'])
  onDoublePress($sourceEvent: MouseEvent | TouchEvent) {
    const $event = new SourcePressEvent($sourceEvent);
    this.appPress.emit(new PressEvent(PressType.Double, $event));
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu($event: MouseEvent | TouchEvent) {
    $event.preventDefault();
    $event.stopImmediatePropagation();
    $event.stopPropagation();
  }

  onPressStart($event: SourcePressEvent) {
    this.startingPress = $event;
    this.thisPress = new Date().getTime();
    this.pressInterrupted = false;
    this.startHoldingNotification($event);
  }

  onPressMove($event: SourcePressEvent) {
    if (this.pressInterrupted || $event.isTouchEvent !== this.startingPress.isTouchEvent) {
      return;
    }

    const distance = Math.abs($event.offsetX - this.startingPress.offsetX) + Math.abs($event.offsetY - this.startingPress.offsetY);
    if (distance > this.MOVE_DISTANCE_BUFFER_PIXELS) {
      this.pressInterrupted = true;
      this.endHoldingNotification($event);
    }
  }

  onPressEnd($event: SourcePressEvent) {
    this.endHoldingNotification($event);
    if (this.pressInterrupted) {
      return;
    }

    if (new Date().getTime() - this.thisPress > this.LONG_PRESS_INTERVAL) {
      this.appPress.emit(new PressEvent(PressType.Long, $event));
    } else {
      this.appPress.emit(new PressEvent(PressType.Single, $event));
    }
    this.pressInterrupted = true;
  }

  private startHoldingNotification($event: SourcePressEvent) {
    const subscription = interval(this.LONG_PRESS_INTERVAL).subscribe(() => {
      this.appPress.emit(new PressEvent(PressType.HoldingStarted, $event));
      subscription.unsubscribe();
    });
    this.holdingNotification = subscription;
  }

  private endHoldingNotification($event: SourcePressEvent) {
    if (this.holdingNotification) {
      this.appPress.emit(new PressEvent(PressType.HoldingEnded, $event));
      this.holdingNotification.unsubscribe();
      this.holdingNotification = null;
    }
  }

}
