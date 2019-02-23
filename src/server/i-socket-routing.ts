import { Socket } from 'socket.io';
import { SocketEvent } from 'src/app/shared/models/socket-event';

export interface ISocketRouting {
  handleEvent(socket: Socket, event: SocketEvent): void;
}
