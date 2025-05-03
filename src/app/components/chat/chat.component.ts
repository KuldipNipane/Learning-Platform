import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import {ClassesService} from '../../services/classes.service'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  @Input() selectedMaterial: string = ""

  messages: { text: string; sent: boolean }[] = [
    { text: 'Hi! How can I help you?', sent: false },
  ];
  newMessage: string = '';

  constructor(
    private classService: ClassesService
  ) {}

  ngOnInit(): void {
    this.scrollToBottom();
    this.selectedMaterial = this.selectedMaterial;
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {  
      this.messages.push({ text: this.newMessage, sent: true });

      this.classService.getChatQueryResponse(this.newMessage, this.selectedMaterial).subscribe(
        (response) => {
          this.messages.push({ text: response["text"], sent: false });
          this.newMessage = ''
        }
      )
    }
  }

}
