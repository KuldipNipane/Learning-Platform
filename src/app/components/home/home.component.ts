import { Component } from '@angular/core';
import { ClassesService } from '../../services/classes.service'
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { SettingsComponent } from '../settings/settings.component';
import { Router } from '@angular/router';


interface InsightItem {
  text: string;
  summary: string;
  additionalLearning: string;
  realLifeExamples: string;
  websiteReferences: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatePipe]
})
export class HomeComponent {
  user: any = {};
  title = 'ui';
  selectedMaterial: string = ""
  classes: any[] = [];
  finalClassesInfo: any[] = [];
  insightsArray: InsightItem[] = [];
  topics: any[] = [];
  showOriginal = false;

  selectedLearningType: string = 'summary';
  quizLoaded: boolean = false
  quizData: any[] = []
  tempSelectedAnswers: { [key: number]: string } = {};  // To store selected answers
  selectedAnswers: { [key: number]: string } = {};  // To store selected answers
  isQuizLoading: boolean = false; // Controls spinner visibility
  examCorner: boolean = false;
  learningMode: boolean = true;
  examMode: boolean = false;

  selectedSubject: string = "";
  selectedChapter: string = "";
  subjects: string[] = [];
  chapters: string[] = [];
  showChapters: boolean = false;
  viewStage: 'subjectSelection' | 'chapterList' | 'fullLearning' = 'subjectSelection';
  showLogoutDropdown = false;
  showExamCorner: boolean = false;

  constructor(private classService: ClassesService,
    private datePipe: DatePipe,
    private router: Router,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    // create a UUID and write to localstorage, everytime the app is 
    // opened check if already exists and assign to a global variable to be accessed in all other components
    if (!localStorage.getItem('uuid')) {
      const uuid = crypto.randomUUID();
      localStorage.setItem('uuid', uuid);
    }

    const userString = localStorage.getItem('user');
    this.user = userString ? JSON.parse(userString) : {};
    this.fetchSubjects()


    let firstTimeUser = localStorage.getItem('firstTimeUser') ?? 'true';
    if (firstTimeUser == "true") {
      this.openUserDialog()
      localStorage.setItem('firstTimeUser', 'false');
    }
  }

  getAvatar(gender: string): string {
    return gender === 'male' ? 'assets/avatar_male.png' : 'assets/avatar_female.png';
  }

  toggleLogoutDropdown() {
    this.showLogoutDropdown = !this.showLogoutDropdown;
  }

  toggleExamCorner(): void {
    this.showExamCorner = !this.showExamCorner;
  }

  fetchSubjects() {
    let schooleBoard = this.user.schoolBoard
    let className = this.user.schoolClass

    this.classService.getSubjectsInfo(schooleBoard, className).subscribe(

      (subjectsInfo) => {
        this.subjects = subjectsInfo
      }
    )
  }

  onSubjectSelect(subject: string) {
    this.selectedSubject = subject
    this.fetchChapters(subject)
    this.selectedChapter = "";
    this.selectedMaterial = ""
    this.examMode = false;
    this.examCorner = false;
    this.selectedLearningType = "";
    this.topics = [];
    this.viewStage = 'chapterList';
  }

  fetchChapters(subject: string) {
    let schooleBoard = this.user.schoolBoard
    let className = this.user.schoolClass

    this.classService.getChapters(schooleBoard, className, subject).subscribe(
      (chaptersInfo) => {
        this.chapters = chaptersInfo
        this.showChapters = true;
      }
    )
  }

  onChapterSelect(chapter: string) {
    this.insightsArray = []
    this.selectedChapter = chapter
    let schooleBoard = this.user.schoolBoard
    let className = this.user.schoolClass
    this.selectedLearningType = 'summary';

    let chapterId = chapter.split(" - ")[0]

    this.classService.getChapter(schooleBoard, className, this.selectedSubject, chapterId).subscribe(
      (response) => {
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            const item = response[key];
            if (key == "topics") {
              let topicsArray = item.split(",")
              this.topics = topicsArray
            } else {
              let jsonObj = JSON.parse(item["json"])

              let insight = {
                "text": item["text"],
                "summary": jsonObj["summary"],
                "additionalLearning": jsonObj["additionalLearning"],
                "realLifeExamples": jsonObj["realLifeExamples"],
                "websiteReferences": this.getHyperlinks((jsonObj["websiteReferences"])),
              }
              this.insightsArray.push(insight)
            }
          }
        }
        this.selectedMaterial = response
        console.log(this.selectedMaterial, this.insightsArray, this.topics);
        this.viewStage = 'fullLearning';
        this.showChapters = false;

      }
    )

  }

  onClassSelect(selClass: string, selClassLabel: string) {
    this.examCorner = false;
    this.insightsArray = []
    this.topics = []
    this.selectedMaterial = selClass
    this.selectedLearningType = 'summary';
    this.classService.getClassData(selClass).subscribe({
      next: (response) => {
        for (const key in response) {

          if (response.hasOwnProperty(key)) {
            const item = response[key];
            if (key == "topics") {
              let topicsArray = item.split(",")
              this.topics = topicsArray
            } else {
              let jsonObj = JSON.parse(item["json"])

              let insight = {
                "text": item["text"],
                "summary": jsonObj["summary"],
                "additionalLearning": jsonObj["additionalLearning"],
                "realLifeExamples": jsonObj["realLifeExamples"],
                "websiteReferences": this.getHyperlinks((jsonObj["websiteReferences"])),
              }
              this.insightsArray.push(insight)
            }
          }
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  getHyperlinks(linksArray: string[]) {
    let finalLinksStr = ""
    for (let i = 0; i < linksArray.length; i++) {
      if (finalLinksStr.length > 0) {
        finalLinksStr = finalLinksStr + "," + linksArray[i]
      } else {
        finalLinksStr = linksArray[i]
      }
    }
    return finalLinksStr
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  convertEpochToDate(epoch: number): string {
    const date = new Date(epoch * 1000);
    return this.datePipe.transform(date, 'd MMM yyyy') || '';
  }

  startQuiz() {
    this.isQuizLoading = true;
    this.classService.getQuizData(this.selectedMaterial).subscribe(
      (quizData) => {

        for (let i = 0; i < quizData.length; i++) {
          let quiz = JSON.parse(quizData[i])
          this.quizData.push(quiz)
        }
        this.quizLoaded = true
        this.isQuizLoading = false;
      }
    )
  }

  switchLearningType(type: string) {
    this.selectedMaterial = this.insightsArray.toString();
    this.selectedLearningType = type;
    this.examCorner = false;
  }

  goToHome() {
    this.resetSelection();
  }

  resetSelection() {
    this.selectedSubject = '';
    this.selectedChapter = '';
    this.topics = [];
    this.showChapters = false;
    this.selectedMaterial = '';
    this.selectedLearningType = 'summary';
    this.viewStage = 'subjectSelection';
  }

  saveAnswer(questionIndex: number) {
    const selectedAnswer = this.selectedAnswers[questionIndex];
    const correctAnswer = this.quizData[questionIndex].correct_answer;
  }

  checkQuizAnswers() {
    // this.selectedAnswers = this.tempSelectedAnswers
    if (Object.keys(this.tempSelectedAnswers).length != this.quizData.length) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '300px',
        data: { message: 'Please answer all questions.' }
      });

      dialogRef.afterClosed().subscribe(result => {
      });
      return
    }

    this.selectedAnswers = JSON.parse(JSON.stringify(this.tempSelectedAnswers));
  }


  openUserDialog() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      disableClose: true,
      width: '550px',

      data: {
        type: 'setting'
      } // You can pass additional data here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });

  }

  toggleExamMode(){
    this.examCorner = true;
    this.selectedLearningType =  '';
    this.selectedMaterial = "";
  }

  getChapterName(chapterName: string): string {
    let finalChapterName = ""
    let tempChapterName = chapterName.split('_')
    // loop through tempChapterName, merging as a title case word
    for (let i = 0; i < tempChapterName.length; i++) {
      finalChapterName = finalChapterName + " " + this.capitalizeFirstLetter(tempChapterName[i])
    }
    return finalChapterName
  }

  logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }

}
