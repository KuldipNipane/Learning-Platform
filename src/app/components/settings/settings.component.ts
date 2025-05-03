import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  selectedOption: any = null; // To store the selected option
  changes: any = {}; // To store the changes
  chatbotStyle: any = {}

  settings = environment.settings

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const storedStyle = localStorage.getItem('chatbotStyle');
    this.chatbotStyle = storedStyle ? JSON.parse(storedStyle) : null;

  }

  selectOption(option: any) {
    this.selectedOption = option; // Set the selected option
    this.changes[option.id] = JSON.stringify(option) // Store the changes
    if (option.id === 'chatbotStyle') {
      this.chatbotStyle = option;
    }
  }

  isSelected(option: any): boolean {
    return option['name'] === this.chatbotStyle['name']; // Check if the option is selected
  }

  close(){
    this.dialogRef.close();
  }

  save(){
    for (const key in this.changes) {
      if (this.changes.hasOwnProperty(key)) {
        const element = this.changes[key];
        localStorage.setItem(key, element);
      }
    }
    this.dialogRef.close();
  }

  getUserSettings(settingsId: string): any {
    return localStorage.getItem(settingsId)
  }
}
