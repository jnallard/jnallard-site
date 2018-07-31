import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Grid, Canvas, Cell } from './models';
import { GameEntry } from '../models/game-entry';
import { GameLostException } from './models/GameOverException.model';
import { Difficulty } from './models/difficulty.model';
import { PressController } from '../../shared/models/long-press-controller';
import { PressEvent } from '../../shared/models/press-event';
import { PressType } from '../../shared/models/press-type';
import { PressButtonType } from '../../shared/models/press-button-type';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas')
  myCanvas: ElementRef;

  public readonly minColumns = 5;
  public readonly maxColumns = 30;
  public readonly minRows = 5;
  public readonly maxRows = 20;
  public minMines = 5;

  public canvas: Canvas;
  public grid: Grid;
  public gameDisabled = false;

  public difficulties = Difficulty.getDifficulties();

  public difficulty: Difficulty = null;
  public gridX = 10;
  public gridY = 10;
  public gridMines = 20;

  public canvasWidth = -1;
  public canvasHeight = -1;

  private viewStarted = false;

  constructor() {
    this.onDifficultyChange(this.difficulties[0], false);
  }

  public static getGameEntry() {
    return new GameEntry('Minesweeper',
      'minesweeper',
      'Find all the mines on the board in this classic mathematical puzzle.',
      'minesweeper.png',
      MinesweeperComponent);
  }

  public onDifficultyChange(difficulty: Difficulty, redraw = true) {
    this.difficulty = difficulty;
    if (!difficulty.isCustom) {
      this.gridX = this.difficulty.columns;
      this.gridY = this.difficulty.rows;
      this.gridMines = this.difficulty.mines;
    }
    this.createGame(redraw);
  }

  public getMaxMines() {
    return Math.floor((this.gridX * this.gridY) / 2);
  }

  public validateAll() {
    return this.validateColumns() && this.validateRows() && this.validateMines();
  }

  public validateColumns() {
    return this.validateMinMax(this.minColumns, this.gridX, this.maxColumns);
  }

  public validateRows() {
    return this.validateMinMax(this.minRows, this.gridY, this.maxRows);
  }

  public validateMines() {
    return this.validateMinMax(this.minMines, this.gridMines, this.getMaxMines());
  }

  private validateMinMax(min: number, value: number, max: number) {
    return min <= value && value <= max;
  }

  public createGame(redraw: boolean = true) {
    if (!this.validateAll()) {
      return;
    }
    this.gameDisabled = false;

    this.grid = new Grid(this.gridX, this.gridY, this.gridMines);
    this.canvasWidth = this.grid.columns * Cell.width;
    this.canvasHeight = this.grid.rows * Cell.height;
    if (redraw) {
      this.redraw();
    }
  }

  private redraw() {
    this.canvas.htmlCanvas.width = this.canvasWidth;
    this.canvas.htmlCanvas.height = this.canvasHeight;
    this.canvas.context2D.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.grid.draw();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const canvasElement = <HTMLCanvasElement>this.myCanvas.nativeElement;
    this.canvas = Canvas.instance;
    this.canvas.initialize(canvasElement);
    this.redraw();
  }

  public click(event: PressEvent) {
    if (this.gameDisabled) { return; }

    try {
      this.grid.handlePressEvent(event);
    } catch (exception) {
      if (exception instanceof GameLostException) {
        this.handleGameOver(exception);
      }
    } finally {
      this.checkGameWon();
    }
  }

  public handleGameOver(exception: GameLostException) {
    console.log(exception);
    this.gameDisabled = true;
    this.grid.revealGameDone(false);

  }

  public checkGameWon() {
    if (this.grid.isGameDone()) {
      this.gameDisabled = true;
      this.grid.revealGameDone(true);
    }
  }
}
