import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import {ClassesService} from '../../services/classes.service'
import {ChatService } from 'src/app/services/chat.service';
import { json } from 'd3';

interface Message {
  text: string;
  sent: boolean;
  avatar?: string;
  images: string[];
}

@Component({
  selector: 'app-teach-me',
  templateUrl: './teach-me.component.html',
  styleUrls: ['./teach-me.component.css']
})
export class TeachMeComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  @Input() selectedMaterial: string = ""
  @Input() suggestedTopics: string[] = []

  @ViewChild('messageInput') messageInput!: ElementRef;

  messages: Message[] = [];
  lastConveration: string[] = [];
  newMessage: string = '';
  largeImageUrl: string | null = null;
  chatbotStyle: any = {}
  user: any = {};

  constructor(
    private classService: ClassesService,
    private chatService: ChatService
  ) {}

  ngAfterViewInit() {
    this.messageInput.nativeElement.focus();
  }

  ngOnInit(): void {
    this.selectedMaterial = this.selectedMaterial;
    const storedStyle = localStorage.getItem('chatbotStyle');
    this.chatbotStyle = storedStyle ? JSON.parse(storedStyle) : null;

    const userString = localStorage.getItem('user');
    this.user = userString ? JSON.parse(userString) : {};

    this.getChatHistory()
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  getChatHistory(){
    const uuid = localStorage.getItem('uuid');
    if (uuid !== null) {
      this.chatService.getChatHistory(uuid, this.selectedMaterial).subscribe(
        (response) => {
          if (response.length === 0) {
            this.messages.push({ text: 'Hey there, Welcome! What are we learning today?', 
              sent: false, avatar: this.chatbotStyle["avatar"], images: [] });
          } else {
            for(let i=0;i<response.length;i++){
              let chatHistory = response[i]
              for(let j=0;j<chatHistory.length;j++){
                let chatHistoryJson = JSON.parse(chatHistory[j])
                let tempMessage: Message = {
                  text: chatHistoryJson["text"],
                  avatar: chatHistoryJson["avatar"],
                  sent: chatHistoryJson["sent"],
                  images: chatHistoryJson["images"],
                }
                this.messages.push(tempMessage)                
              }
            }
          }
        // Call scrollToBottom after processing chat history
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
        }
      )
    }
  }

  sendMessage() {
    var google_image_search_query = ''
    if (this.newMessage.trim()) {
      let userGender = (this.user as any)['gender']
      let userAvatarImg =  'assets/avatar_'+userGender+'.png' 
      this.messages.push({ text: this.newMessage, sent: true,avatar: userAvatarImg, images: [] });
      let self = this;
      let chatStyle = {
        tone: this.chatbotStyle["description"],
        personality: this.chatbotStyle["name"]
      }
      this.classService.getTeachmeQueryResponse(this.newMessage, chatStyle, this.selectedMaterial).subscribe(
        (response) => {
          let jsonRes = JSON.parse(response["text"])

          this.messages.push({ text: jsonRes["reply"], sent: false, avatar: this.chatbotStyle["avatar"], images: []});
          google_image_search_query = jsonRes["google_image_search_query"]
          if(self.messages.length < 10){
            this.fetchImages(google_image_search_query, self.messages)
          }          
          this.newMessage = ''
          setTimeout(() => {
            this.scrollToBottom();
          }, 0);            
        }
      )
    }
  
  }

  fetchImages(google_image_search_query: string, messages: Message[]) {
    this.classService.getImages(google_image_search_query).subscribe(
      (image_results: string[]) => {
        messages[messages.length-1].images = image_results;

        let tempMessageQuestion = {
          text: messages[messages.length-2].text,
          avatar: messages[messages.length-2].avatar,
          sent: messages[messages.length-2].sent,
          images: messages[messages.length-2].images
        }

        this.lastConveration.push(JSON.stringify(tempMessageQuestion))

        let tempMessageAnswer = {
          text: messages[messages.length-1].text,
          sent: messages[messages.length-1].sent,
          avatar: messages[messages.length-1].avatar,
          images: messages[messages.length-1].images
        }
        this.lastConveration.push(JSON.stringify(tempMessageAnswer))
        const uuid = localStorage.getItem('uuid');
        if (uuid !== null) {
          this.chatService.saveChatMessage(uuid, this.selectedMaterial, this.lastConveration).subscribe()
        }
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      }
    );    
  }

  showLargeImage(url: string) {
    this.largeImageUrl = url;
  }

  closeLargeImage() {
    this.largeImageUrl = null;
  }

  selectTopic(topic :string){
    this.newMessage = topic;
  }

}
