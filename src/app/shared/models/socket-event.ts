import { SocketData } from './socket-data';

export class SocketEvent {
  public sessionId: string;
  constructor(public category: string, public subcategory: string, public data: SocketData) {}
}
