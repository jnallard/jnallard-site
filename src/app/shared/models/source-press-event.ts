export class SourcePressEvent {
  constructor(sourceEvent: MouseEvent | TouchEvent, borderWidth: number, stopPropagation = true, preventDefault = true) {
    console.log(window.TouchEvent);
    if (window.TouchEvent && sourceEvent instanceof TouchEvent) {
      const touchEvent = sourceEvent as TouchEvent;
      const target = sourceEvent.target as HTMLElement;
      const bounds = target.getBoundingClientRect();
      this.which = 1;
      this.offsetX = touchEvent.changedTouches[0].clientX - bounds.left - borderWidth;
      this.offsetY = touchEvent.changedTouches[0].clientY - bounds.top - borderWidth;
    } else {
      const mouseEvent = sourceEvent as MouseEvent;
      this.which = mouseEvent.which;
      this.offsetX = mouseEvent.offsetX;
      this.offsetY = mouseEvent.offsetY;
      this.isTouchEvent = true;
    }

    if (preventDefault) {
      sourceEvent.preventDefault();
    }

    if (stopPropagation) {
      sourceEvent.stopPropagation();
    }
  }

  public which: number;
  public offsetX: number;
  public offsetY: number;
  public isTouchEvent = false;
}
