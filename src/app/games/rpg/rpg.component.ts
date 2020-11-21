import { Component, OnInit } from '@angular/core';
import { GameEntry } from '../models/game-entry';

@Component({
  selector: 'app-rpg',
  templateUrl: './rpg.component.html',
  styleUrls: ['./rpg.component.css']
})
export class RpgComponent implements OnInit {

  public static getGameEntry() {
    return new GameEntry('RPJosh',
      'rpg',
      'An RPG game. [In active development]',
      'placeholder.png',
      RpgComponent);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
