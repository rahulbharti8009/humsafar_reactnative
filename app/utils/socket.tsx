import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './constant';
import { log } from './helper';
class MySocket {
  private static instance: MySocket;
  private socket: Socket | null = null;
  private userId: string | null = null;

  constructor() {
    console.log('Singleton instance created');
  }

  public static getInstance() : MySocket{
    if (!MySocket.instance) {
      this.instance = new MySocket();
    }
    return this.instance;
  }

  public createSocket(userId: string): Socket {
    if (!userId) {
      throw new Error('userId is required to create socket');
    }
    this.userId = userId;
    if(!this.socket){
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        autoConnect: false,
        query: {
          userId
        },
      });
    }
    return this.socket;
  }


  public getSocket(): Socket {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }
    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      log('socket', 'disconnected');
    }
  }
}

export default MySocket;
