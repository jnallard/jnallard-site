import { ISocketRouting } from 'src/server/i-socket-routing';
import { Socket } from 'socket.io';
import { SocketEvent } from 'src/app/shared/models/socket-event';

export class MinesweeperSocketRouting implements ISocketRouting {
  handleEvent(socket: Socket, event: SocketEvent): void {
    console.log('MinesweeperSocketRouting');
    socket.emit('minesweeper', event);
  }
}
