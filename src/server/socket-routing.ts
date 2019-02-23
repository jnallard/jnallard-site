import { MainSocketRouting } from './main-socket-routing';
import { ISocketRouting } from './i-socket-routing';
import { Socket } from 'socket.io';
import { SocketEvent } from 'src/app/shared/models/socket-event';
import { MinesweeperSocketRouting } from './games/minesweeper/minesweerper-socket-routing';

class RoutingSubcategory {
  constructor(public name: string, public router: ISocketRouting) {}
}

class RoutingCategory {
  constructor(public name: string, public subcategories: RoutingSubcategory[]) {}
}

export class SocketRouting {
  routings = [
    new RoutingCategory('app', [
      new RoutingSubcategory('main', new MainSocketRouting())
    ]),
    new RoutingCategory('games', [
      new RoutingSubcategory('minesweeper', new MinesweeperSocketRouting())
    ])
  ];

  sendEvent(socket: Socket, event: SocketEvent) {
    const category = this.routings.find(x => x.name === event.category);
    if (category) {
      const subcategory = category.subcategories.find(x => x.name === event.subcategory);
      if (subcategory) {
        subcategory.router.handleEvent(socket, event);
      }
    }
  }
}
