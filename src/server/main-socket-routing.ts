import { ISocketRouting } from './i-socket-routing';
import { Socket } from 'socket.io';
import { SocketEvent } from 'src/app/shared/models/socket-event';

export class MainSocketRouting implements ISocketRouting {
  handleEvent(socket: Socket, event: SocketEvent): void {
    console.log('MainSocketRouting');
    socket.emit('loaded', event);
  }

}
