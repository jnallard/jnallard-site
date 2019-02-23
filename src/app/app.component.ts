import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameList } from './games/models/game-list';
import { Socket } from 'ngx-socket-io';
import { SocketEvent } from './shared/models/socket-event';

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
    this.socket.emit('event', new SocketEvent('app', 'main', null));
  }

}
