import { Component, OnInit } from '@angular/core';
import { GameList } from '../games/models/game-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public gameList = GameList.instance;

  constructor() { }

  ngOnInit() {
  }

}
