import { Injectable } from '@angular/core';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment';
import IPost from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined

  constructor() { }

  setupSocketConnection() {
    this.socket = io('http://localhost:3000')
  }

  emitCreatePost(post: IPost) {
    this.socket?.emit('createPost', post)
  }

  receiveCreatePost() {
    return new Observable<IPost>(observer => {
      this.socket?.on('createPost', (post: IPost) => {
        observer.next(post)
      })
    })
  }
}
