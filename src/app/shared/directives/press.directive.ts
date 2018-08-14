import { Directive, EventEmitter, HostListener, Input, Output, ElementRef, OnInit} from '@angular/core';
import { PressEvent } from '../models/press-event';
import { PressType } from '../models/press-type';
import { interval, Subscription } from 'rxjs';
import { SourcePressEvent } from '../models/source-press-event';

@Directive({
  selector: '[appPress]'
})
export class PressDirective implements OnInit {
  @Output() appPress = new EventEmitter();

  @Input('borderWidth') borderWidth = 0;

  constructor(private el: ElementRef) { }

  private thisPress: number = new Date().getTime();
  private startingPress: SourcePressEvent = null;
  private pressInterrupted = true;
  private holdingNotification: Subscription = null;

  private readonly LONG_PRESS_INTERVAL = 250;
  private readonly MOVE_DISTANCE_BUFFER_PIXELS = 10;

  ngOnInit() {
    this.el.nativeElement.style.borderWidth = `${this.borderWidth}px`;
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart($event: TouchEvent) {
    const sourceEvent = new SourcePressEvent($event, this.borderWidth, true, false);
    this.appPress.emit(new PressEvent(PressType.Hover, sourceEvent));
    this.onPressStart(sourceEvent);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove($event: TouchEvent) {
    const sourceEvent = new SourcePressEvent($event, this.borderWidth, false, false);
    this.appPress.emit(new PressEvent(PressType.Hover, sourceEvent));
    this.onPressMove(sourceEvent);
  }

  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  @HostListener('touchleave', ['$event'])
  onTouchEnd($event: TouchEvent) {
    const sourceEvent = new SourcePressEvent($event, this.borderWidth);
    this.appPress.emit(new PressEvent(PressType.Hover, sourceEvent));
    this.onPressEnd(sourceEvent);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown($event: MouseEvent) {
    this.onPressStart(new SourcePressEvent($event, this.borderWidth));
  }

  @HostListener('mouseleave', ['$event'])
  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent) {
    this.onPressMove(new SourcePressEvent($event, this.borderWidth, false, false));
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp($event: TouchEvent) {
    this.onPressEnd(new SourcePressEvent($event, this.borderWidth));
  }

  @HostListener('dblclick', ['$event'])
  onDoublePress($sourceEvent: MouseEvent | TouchEvent) {
    const $event = new SourcePressEvent($sourceEvent, this.borderWidth);
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
      this.appPress.emit(new PressEvent(PressType.Hover, $event));
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
