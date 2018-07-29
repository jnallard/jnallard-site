import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Grid, Canvas } from './models';
import { GameEntry } from '../models/game-entry';

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

  public static getGameEntry() {
    return new GameEntry('Minesweeper',
      'minesweeper',
      'Find all the mines on the board in this classic mathematic puzzle.',
      'minesweeper.png',
      MinesweeperComponent);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log(`ngAfterViewInit`);
    this.canvas = new Canvas(<HTMLCanvasElement>this.myCanvas.nativeElement);
    const grid = new Grid(10, 10, 1);
    grid.draw(this.canvas);
  }
}
