import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { ExamService } from 'src/app/services/exam.service';
import { json } from 'd3';

interface Message {
  text: string;
  sent: boolean;
  avatar?: string;
  images: string[];
}

@Component({
  selector: 'app-exam-doubt',
  templateUrl: './exam-doubt.component.html',
  styleUrls: ['./exam-doubt.component.css']
})
export class ExamDoubtComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  @Input() selectedSection: string = "";
  @Input() selectedQuestion: string = "";
  @Input() currentPaperPath: string = "";

  questionNumber: number = 0

  messages: Message[] = [];
  lastConveration: string[] = [];
  newMessage: string = '';
  largeImageUrl: string | null = null;
  chatbotStyle: any = {}
  
  constructor(
    private examService: ExamService,
  ) {}

  ngOnInit(): void {
    const storedStyle = localStorage.getItem('chatbotStyle');
    this.chatbotStyle = storedStyle ? JSON.parse(storedStyle) : null;

    this.messages.push({ text: 'Hey! what doubt do you have about this question?', 
      sent: false, avatar: this.chatbotStyle["avatar"], images: [] });    
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = 
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    
    let msg: Message = {
      text: this.newMessage,
      sent: true,
      images: []
    };
    
    this.messages.push(msg);    
    let chatStyle = {
      tone: this.chatbotStyle["description"],
      personality: this.chatbotStyle["name"]
    }
    let self = this;
    // chatStyle: any, questionaperPath: string, section: string, questionNumber: number, query: string
    this.examService.doubtChat(chatStyle, this.currentPaperPath, 
      this.selectedSection, parseInt(this.selectedQuestion), this.newMessage).subscribe(
      (response: any) => {
          
          self.messages.push({ text: response["explain_question_response"], sent: false, avatar: this.chatbotStyle["avatar"], images: []});
      })

    this.newMessage = '';
  }

  closeDoubt(){
  }



}
