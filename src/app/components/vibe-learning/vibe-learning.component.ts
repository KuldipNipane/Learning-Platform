import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';


import { ChatService } from 'src/app/services/chat.service';
import { ClassesService } from 'src/app/services/classes.service';


@Component({
  selector: 'app-vibe-learning',
  templateUrl: './vibe-learning.component.html',
  styleUrls: ['./vibe-learning.component.css']
})
export class VibeLearningComponent implements OnInit {
  lcClientSecret: string = environment.lcClientSecret;

  @Input() selectedMaterial: string = ""
  @Input() selectedSubject: string = ""
  @Input() suggestedTopics: string[] = []

  isSessionActive = false;
  events: any[] = [];
  dataChannel!: RTCDataChannel | null;
  peerConnection!: RTCPeerConnection | null;
  audioElement!: HTMLAudioElement;
  audioBGPlayBackElement!: HTMLAudioElement;
  EPHEMERAL_KEY: string = ""
  learningStarted: boolean = false;
  isPlaying: boolean = false;
  systemMessage: any = {}
  audioFiles: string[] = [];
  audioSrc: SafeResourceUrl | null = null;

  chatBotName: string = ""
  chatBotStyle: string = ""

  languages = [
    { value: 'English'},
    { value: 'Kannada'},
    { value: 'Hindi'},
    { value: 'Tamil'},
    { value: 'Marathi'},
  ];
  selectedLanguage = 'English'; // Default selection


  ngOnInit() {
    const storedStyle = localStorage.getItem('chatbotStyle');
    let chatbotStyleData = storedStyle ? JSON.parse(storedStyle) : null;
    this.chatBotName = chatbotStyleData["name"]    
    this.chatBotStyle = chatbotStyleData["description"]  
  }

  constructor(
    private chatService: ChatService,
    private classService: ClassesService,
    private sanitizer: DomSanitizer
  ) {}

  startEphemeralKeyRefresh() {
    setInterval(() => {
      this.refreshEphemeralKey();
    }, 55000); // Run every 55 seconds
  }
  
  refreshEphemeralKey() {
    // Call your API to get a new ephemeral key
    this.chatService.getOpenAiEphToken(this.lcClientSecret).subscribe(
      (res:any) => {
        const newKey = res?.client_secret?.value;
        if (newKey) {
          this.EPHEMERAL_KEY = newKey;
        }
      },
      (error) => {
        console.error("Failed to refresh Ephemeral Key:", error);
      }
    );
  }

  async startVibeLearning(){
    // Create Peer Connection
    this.learningStarted = true
    this.peerConnection = new RTCPeerConnection();

    // Setup remote audio stream
    this.audioElement = new Audio();
    
    this.audioElement.addEventListener("emptied", () => {
      this.isPlaying = false;
    });
    
    this.audioElement.autoplay = true;
    this.peerConnection.ontrack = (event) => {
      this.audioElement.srcObject = event.streams[0];
      const audioTrack = event.streams[0].getAudioTracks()[0];
    };

    // Add local microphone track
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.peerConnection.addTrack(mediaStream.getTracks()[0]);

    // Setup Data Channel for messaging
    this.dataChannel = this.peerConnection.createDataChannel('oai-events');
    this.setupDataChannel();

    // Create SDP offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    // Send offer to OpenAI
    const baseUrl = 'https://api.openai.com/v1/realtime';
    // const model = 'gpt-4o-realtime-preview-2024-12-17';
    // const model = 'gpt-4o-mini-realtime-preview-2024-12-17';
    const model = 'gpt-4o-mini-audio-preview-2024-12-17';
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${this.EPHEMERAL_KEY}`,
        'Content-Type': 'application/sdp',
      },
    });

    // Set remote SDP answer
    const answer: RTCSessionDescriptionInit = { type: 'answer', sdp: await sdpResponse.text() };
    await this.peerConnection.setRemoteDescription(answer);
    this.isSessionActive = true;
  }

  async startTeaching() {
    let user = localStorage.getItem('user')
    if (user) {
      const parsedUser = JSON.parse(user)
      let classId = parsedUser["schoolClass"]
      let board = parsedUser["schoolBoard"]

      let self = this;

      this.classService.getLearningAudio(
        board,
        classId,
        this.selectedSubject,
        this.selectedMaterial
      ).subscribe(
        (res) => {
          self.audioFiles = res["mp3_files"]
          self.startTeachingPlayback()          
        }
      )
    }
  }

  startTeachingPlayback() {
    const filePath = '../DATA/LC_STUDY_MATERIAL/CBSE/10/science/Chemical_Reactions/audio/1.mp3';
    const audioUrl = `http://localhost:5000/api/material/get_audio?file_path=${encodeURIComponent(filePath)}`;
    
    this.audioBGPlayBackElement =  new Audio()

    // Sanitize the URL to avoid security issues
    this.audioSrc = this.sanitizer.bypassSecurityTrustResourceUrl(audioUrl);
    setTimeout(() => {
      if (this.audioBGPlayBackElement) {
        this.audioBGPlayBackElement.src = audioUrl;
        this.audioBGPlayBackElement.load();
        this.isPlaying = true;
        this.learningStarted = true;
        this.audioBGPlayBackElement.play()        
          .catch(error => console.error('Playback Error:', error));
        this.startSession()
      } else {
        console.error("Audio element is not initialized.");
      }
    }, 1000);
  }

  async startSession() {
    this.systemMessage = {
      role: "system",
      content: `You are an interactive AI tutor named ${this.chatBotName}, with personality - ${this.chatBotStyle}, who teaches ${this.selectedMaterial} 
      chapter from CBSE class 10 from beginning. If student asks any doubts you clearly explain.
      Also strictly stick the the topic ${this.selectedMaterial}, if student asks anything other than ${this.selectedMaterial}, 
      gently respond its out of topic and come back the topic. And communicate in ${this.selectedLanguage} but use native english words where ever necessary`
    };

    try{
        let self = this;
        this.chatService.getOpenAiEphToken(this.lcClientSecret).subscribe(
          (res: any) => {
            if (res && res.client_secret && res.client_secret.value) {
              self.EPHEMERAL_KEY = res.client_secret.value;
              this.startEphemeralKeyRefresh()
              self.startVibeLearning()
              
            } else {
              console.error('Invalid response format:', res);
            }
          },
          (error) => {
            console.error('Error fetching token:', error);
          }
        );
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }

  stopSession() {
    if (this.dataChannel) {
      this.dataChannel.close();
    }

    if (this.peerConnection) {
      this.peerConnection.getSenders().forEach((sender) => sender.track?.stop());
      this.peerConnection.close();
    }

    this.isSessionActive = false;
    this.peerConnection = null;
    this.dataChannel = null;
    this.isPlaying = false;
  }

  sendTextMessage(message: string) {
    if (this.dataChannel) {
      const event = {
        type: 'conversation.item.create',
        item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: message }] },
      };

      this.dataChannel.send(JSON.stringify(event));
      this.dataChannel.send(JSON.stringify({ type: 'response.create' }));

      this.events.unshift({ timestamp: new Date().toLocaleTimeString(), content: message });
    } else {
      console.error('No data channel available to send messages.');
    }
  }

  setupDataChannel() {
    if (!this.dataChannel) return;

    this.dataChannel.addEventListener('message', (event) => {      
      const receivedEvent = JSON.parse(event.data);
      receivedEvent.timestamp = new Date().toLocaleTimeString();
      this.events.unshift(receivedEvent);
      if(receivedEvent["type"] == "output_audio_buffer.stopped"){
        this.isPlaying = false
      }

      if(receivedEvent["type"] == "output_audio_buffer.started"){
        this.isPlaying = true
      }            
    });

    this.dataChannel.addEventListener('open', () => {
      this.isSessionActive = true;
      this.events = [];
      setTimeout(()=>{
        this.startConversationChannel();
      }, 1000)
    });
  }

  startConversationChannel(){
    if (this.dataChannel) {
      const event = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'system',
          content: [{ type: 'input_text', text: this.systemMessage.content }]
        }
      };
  
      this.dataChannel.send(JSON.stringify(event));
      this.dataChannel.send(JSON.stringify({ type: 'response.create' })); // Request response
      } else {
      console.error('No data channel available to send system message.');
    }    
  }

  onLanguageChange(newLanguage: string) {
    console.log("Selected Language:", newLanguage);
    this.selectedLanguage = newLanguage;
  
    // You can add any logic here, such as storing the selected language in localStorage:
    // localStorage.setItem('preferredLanguage', newLanguage);
  }

  ngOnDestroy() {
    this.stopSession();
  }


}
