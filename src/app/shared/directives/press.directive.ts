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
    this.onPressStart(new SourcePressEvent($event));
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove($event: TouchEvent) {
    this.onPressMove(new SourcePressEvent($event));
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd($event: TouchEvent) {
    this.onPressEnd(new SourcePressEvent($event));
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown($event: MouseEvent) {
    this.onPressStart(new SourcePressEvent($event));
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent) {
    this.onPressMove(new SourcePressEvent($event));
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp($event: TouchEvent) {
    this.onPressEnd(new SourcePressEvent($event));
  }

  onPressStart($event: SourcePressEvent) {
    this.startingPress = $event;
    this.thisPress = new Date().getTime();
    this.pressInterrupted = false;
    this.startHoldingNotification($event);
  }

  onPressMove($event: SourcePressEvent) {
    if (this.pressInterrupted) {
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

  @HostListener('dblclick', ['$event'])
  onDoublePress($sourceEvent: MouseEvent | TouchEvent) {
    const $event = new SourcePressEvent($sourceEvent);
    this.appPress.emit(new PressEvent(PressType.Double, $event));
  }

  private startHoldingNotification($event: SourcePressEvent) {
    this.holdingNotification = interval(this.LONG_PRESS_INTERVAL).subscribe(() => {
      this.appPress.emit(new PressEvent(PressType.HoldingStarted, $event));
    });
  }

  private endHoldingNotification($event: SourcePressEvent) {
    if (this.holdingNotification) {
      this.appPress.emit(new PressEvent(PressType.HoldingEnded, $event));
      this.holdingNotification.unsubscribe();
      this.holdingNotification = null;
    }
  }

}
