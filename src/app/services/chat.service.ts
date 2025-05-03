import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  // Get chat history for a topic
  getChatHistory(userId: string, topic: string) {
    return this.http.get<any[]>(`${this.apiUrl}/chat_history/${userId}/${topic}`);
  }

  // Save new chat message
  saveChatMessage(userId: string, topic: string, msg: string[]) {
    return this.http.post(`${this.apiUrl}/save_chat/${userId}/${topic}`, msg);
  }

  getOpenAiEphToken(secret: string) {
    const headers = new HttpHeaders({
      "X-API-KEY": secret,
      'Content-Type': 'application/json'
    });    
    return this.http.get(`${this.apiUrl}/openai/token`, {headers});
  }
}
