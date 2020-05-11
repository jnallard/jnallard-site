import { SocketData } from './socket-data';

export class SocketEvent {
  constructor(public category: string, public subcategory: string, public data: SocketData) {}
}
