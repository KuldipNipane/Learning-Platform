import { Component } from '@angular/core';
import {ClassesService} from './services/classes.service'
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent {
  title = 'ui';

  constructor(private classService: ClassesService, 
    public dialog: MatDialog){
  }

  ngOnInit(): void {
    // create a UUID and write to localstorage, everytime the app is 
    // opened check if already exists and assign to a global variable to be accessed in all other components
    if (!localStorage.getItem('uuid')) {
      const uuid = crypto.randomUUID();
      localStorage.setItem('uuid', uuid);
      localStorage.setItem('version', "v3-apr-1");
    }
  }


}
