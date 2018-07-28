import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Grid, Canvas } from './models';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas')
  myCanvas: ElementRef;

  public canvas: Canvas;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log(`ngAfterViewInit`);
    this.canvas = new Canvas(<HTMLCanvasElement>this.myCanvas.nativeElement);
    const grid = new Grid(10, 10, 1);
    grid.draw(this.canvas);
  }
}
