import EventEmitter from 'events';
import { Protocol } from './Protocol';
import { OCPP_PROTOCOL_1_6 } from './schemas';

export class Client extends EventEmitter {
  private connection: Protocol | null = null;

  private cpId: string;

  constructor(cpId: string) {
    super();
    this.cpId = cpId;
  }

  protected getCpId(): string {
    return this.cpId;
  }

  protected setConnection(connection: Protocol | null): void {
    this.connection = connection;
  }

  protected callRequest(request: string, payload: any): Promise<any> {
    if (this.connection) {
      return this.connection.callRequest(request, payload);
    }
    throw new Error('Charging point not connected to central system');
  }

  protected connect(centralSystemUrl: string) {
    const ws = new WebSocket(centralSystemUrl + this.getCpId(), [OCPP_PROTOCOL_1_6]);

    ws.addEventListener('close', (event: CloseEvent): any => {
      this.setConnection(null);
      this.emit('close', event.code, event.reason);
    });

    ws.addEventListener('open', () => {
      if (ws) {
        this.setConnection(new Protocol(this, ws));
        this.emit('connect');
      }
    });

    ws.addEventListener('error', (err) => {
      this.emit('error', err);
    });
  }
}
