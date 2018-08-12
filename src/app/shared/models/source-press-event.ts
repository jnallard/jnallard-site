export class SourcePressEvent {
  constructor(sourceEvent: MouseEvent | TouchEvent) {
    if (sourceEvent instanceof TouchEvent) {
      const touchEvent = sourceEvent as TouchEvent;
      const target = sourceEvent.target as HTMLElement;
      const bounds = target.getBoundingClientRect();
      this.which = 1;
      this.offsetX = touchEvent.changedTouches[0].clientX - bounds.left;
      this.offsetY = touchEvent.changedTouches[0].clientY - bounds.top;
    } else {
      const mouseEvent = sourceEvent as MouseEvent;
      this.which = mouseEvent.which;
      this.offsetX = mouseEvent.offsetX;
      this.offsetY = mouseEvent.offsetY;
    }

    sourceEvent.preventDefault();
    sourceEvent.stopPropagation();
  }

  public which: number;
  public offsetX: number;
  public offsetY: number;
}
