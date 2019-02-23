import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameList } from './games/models/game-list';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public isCollapsed = true;
  public gameList = GameList.instance;

  constructor(private router: Router, private socket: Socket) {
    router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }

}
