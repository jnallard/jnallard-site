import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameList } from './games/models/game-list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public isCollapsed = true;
  public gameList = GameList.instance;

  constructor(private router: Router) {
    router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }

}
