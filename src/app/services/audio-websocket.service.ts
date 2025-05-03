import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class AudioWebSocketService {
  constructor(private socket: Socket) {}

  startLearning(details: any){
    let detailsJsonStr = JSON.stringify(details)
    this.socket.emit("start_teaching", detailsJsonStr)
  }

  sendAudio(audioData: string) {
    this.socket.emit("send_audio", audioData);
  }

  receiveAudio() {
    return this.socket.fromEvent<string>("audio_chunk");
  }
}
