import { Component, OnInit } from '@angular/core';
import { GameList } from './models/game-list';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  public gameList = GameList.instance;

  constructor() { }

  ngOnInit() {
  }

}
