import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AppRoutingModule } from './app-routing.module'; // Import your routing module


import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppComponent } from './app.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ChatComponent } from './components/chat/chat.component';
import { ConceptMapComponent } from './components/concept-map/concept-map.component';
import { TeachMeComponent } from './components/teach-me/teach-me.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ExamComponent } from './components/exam/exam.component';
import { ExamDoubtComponent } from './components/exam-doubt/exam-doubt.component';
import { StudyMaterialComponent } from './components/study-material/study-material.component';
import { VibeLearningComponent } from './components/vibe-learning/vibe-learning.component';

import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { AudioWebSocketService } from "./services/audio-websocket.service";
import { UnderscoreToSpacePipe } from './pipes/underscore-to-space.pipe';


const config: SocketIoConfig = {
  url: "http://localhost:5000", // Flask-SocketIO server URL
  options: {
    transports: ["websocket"],
  },
};



@NgModule({
  declarations: [AppComponent, DialogComponent, ChatComponent, ConceptMapComponent, TeachMeComponent, SignupComponent, LoginComponent, HomeComponent, SettingsComponent, ExamComponent, ExamDoubtComponent, StudyMaterialComponent, VibeLearningComponent, UnderscoreToSpacePipe],
  imports: [
    AppRoutingModule, // Include the AppRoutingModule here
    RouterModule, // Include RouterModule if it's not in AppRoutingModule
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    HttpClientModule,
    MatRadioModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatProgressBarModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [AudioWebSocketService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
