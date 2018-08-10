import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { PressEvent } from '../models/press-event';
import { PressType } from '../models/press-type';
import { interval, Subscription } from 'rxjs';
import { ISourcePressEvent } from '../models/isource-press-event';

@Directive({
  selector: '[appPress]'
})
export class PressDirective {
  @Output() appPress = new EventEmitter();

  private thisPress: number = new Date().getTime();
  private startingPress: ISourcePressEvent = null;
  private pressInterrupted = true;
  private holdingNotification: Subscription = null;


  private readonly LONG_PRESS_INTERVAL = 250;
  private readonly MOVE_DISTANCE_BUFFER_PIXELS = 10;

  @HostListener('touchstart', ['$event'])
  onTouchStart($event: TouchEvent) {
    this.onPressStart(this.convertTouchEvent($event));
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove($event: TouchEvent) {
    this.onPressMove(this.convertTouchEvent($event));
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd($event: TouchEvent) {
    this.onPressEnd(this.convertTouchEvent($event));
  }

  @HostListener('mousedown', ['$event'])
  onPressStart($event: ISourcePressEvent) {
    this.startingPress = $event;
    this.thisPress = new Date().getTime();
    this.pressInterrupted = false;
    this.startHoldingNotification($event);
  }

  @HostListener('mousemove', ['$event'])
  onPressMove($event: ISourcePressEvent) {
    if (this.pressInterrupted) {
      return;
    }

    const distance = Math.abs($event.offsetX - this.startingPress.offsetX) + Math.abs($event.offsetY - this.startingPress.offsetY);
    if (distance > this.MOVE_DISTANCE_BUFFER_PIXELS) {
      this.pressInterrupted = true;
      this.endHoldingNotification($event);
    }
    return;
  }

  @HostListener('mouseup', ['$event'])
  onPressEnd($event: ISourcePressEvent) {
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
  onDoublePress($event: ISourcePressEvent) {
    this.appPress.emit(new PressEvent(PressType.Double, $event));
  }

  private convertTouchEvent($event: TouchEvent) {
    const target = $event.target as HTMLElement;
    const bounds = target.getBoundingClientRect();
    return {
      offsetX: ($event.changedTouches[0].clientX - bounds.left),
      offsetY: ($event.changedTouches[0].clientY - bounds.top),
      which: 1
    } as ISourcePressEvent;
  }

  private startHoldingNotification($event: ISourcePressEvent) {
    this.holdingNotification = interval(this.LONG_PRESS_INTERVAL).subscribe(() => {
      this.appPress.emit(new PressEvent(PressType.HoldingStarted, $event));
    });
  }

  private endHoldingNotification($event: ISourcePressEvent) {
    if (this.holdingNotification) {
      this.appPress.emit(new PressEvent(PressType.HoldingEnded, $event));
      this.holdingNotification.unsubscribe();
      this.holdingNotification = null;
    }
  }

}
