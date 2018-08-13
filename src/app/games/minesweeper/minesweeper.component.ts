import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Grid, Canvas, Cell } from './models';
import { GameEntry } from '../models/game-entry';
import { GameLostException } from './models/game-over-exception';
import { Difficulty } from './models/difficulty.model';
import { PressEvent } from '../../shared/models/press-event';
import { timer } from 'rxjs';
import { DifficultyGameData } from './models/difficulty-game-data';
import { DefaultGameData } from './models/default-game-data';

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

  public startTime: Date = null;
  public endTime: Date = null;
  public displayTime = '0:00';

  public defaultGameData: DefaultGameData;
  public gameData: DifficultyGameData;

  constructor() {
    this.defaultGameData = new DefaultGameData();
    this.onDifficultyChange(this.defaultGameData.lastDifficulty, false);
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
    } else {
      this.gridX = this.defaultGameData.customX;
      this.gridY = this.defaultGameData.customY;
      this.gridMines = this.defaultGameData.customMines;
    }
    this.gameData = new DifficultyGameData(difficulty.name);
    this.createGame(redraw);
    this.defaultGameData.lastDifficulty = difficulty;
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
    this.startTime = null;
    this.endTime = null;

    this.grid = new Grid(this.gridX, this.gridY, this.gridMines);
    this.canvasWidth = this.grid.columns * Cell.width;
    this.canvasHeight = this.grid.rows * Cell.height;
    if (redraw) {
      this.redraw();
    }

    if (this.difficulty.isCustom) {
      this.defaultGameData.customX = this.gridX;
      this.defaultGameData.customY = this.gridY;
      this.defaultGameData.customMines = this.gridMines;
    }
  }

  private redraw() {
    this.canvas.htmlCanvas.width = this.canvasWidth;
    this.canvas.htmlCanvas.height = this.canvasHeight;
    this.canvas.context2D.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.grid.draw();
  }

  ngOnInit() {
    const source = timer(1000, 100);
    source.subscribe(t => {
        this.displayTime = this.updateTime();
    });
  }

  ngAfterViewInit(): void {
    const canvasElement = <HTMLCanvasElement>this.myCanvas.nativeElement;
    this.canvas = Canvas.instance;
    this.canvas.initialize(canvasElement);
    this.redraw();
  }

  public click(event: PressEvent) {
    if (this.gameDisabled) { return; }

    if (this.startTime == null) {
      this.startTime = new Date();
      this.gameData.attempts++;
    }

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
    this.endTime = new Date();
    this.grid.revealGameDone(false);

  }

  public checkGameWon() {
    if (this.grid.isGameDone()) {
      this.gameDisabled = true;
      this.endTime = new Date();
      this.grid.revealGameDone(true);
      this.gameData.wins++;
      this.gameData.autoReveals++;

      const timeElapsed = this.getTimeElasped();
      if (this.gameData.bestTimeMilliseconds === 0 || timeElapsed < this.gameData.bestTimeMilliseconds) {
        this.gameData.bestTimeMilliseconds = timeElapsed;
      }
    }
  }

  public autoReveal() {
    if (this.gameData.autoReveals > 0) {
      this.gameData.autoReveals--;
      this.gameData.autoRevealsUsed++;
      this.grid.autoRevealFlag();
    }
  }

  public isGameStarted() {
    return this.startTime != null;
  }

  private getTimeElasped() {
    let milliseconds = 0;
    if (this.startTime && !this.endTime) {
      milliseconds = new Date().getTime() - this.startTime.getTime();
    } else if (this.startTime && this.endTime) {
      milliseconds = this.endTime.getTime() - this.startTime.getTime();
    }
    return milliseconds;
  }

  private updateTime() {
    return this.convertMillisecondsToTimeString(this.getTimeElasped());
  }

  public convertMillisecondsToTimeString(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 60000);
    return `${minutes}:${seconds < 10 ? '0' + seconds :  seconds}`;
  }
}
