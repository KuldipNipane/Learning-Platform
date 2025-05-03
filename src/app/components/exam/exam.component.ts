import { Component, OnInit, Input } from '@angular/core';
import { ExamService } from 'src/app/services/exam.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment'
import { MatDialog } from '@angular/material/dialog';
import { ExamDoubtComponent } from '../exam-doubt/exam-doubt.component'
@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  @Input() selectedMaterial: string = ""
  questionPapers: any[] = []
  subjects: any[] = []
  questionPaperJson: any[] = []
  selectedPaper: string = ""
  showPaperSelector: boolean = false
  answers: string[] = [];
  mockExamMode: boolean = false
  showSubjectSelector: boolean = true
  showSubjectPaperSelector: boolean = false
  selectedSubject: string = ""
  questionPaperUrl: SafeResourceUrl;
  currentPaperPath: string = "";
  tempQuestionPaperUrl: string = "";
  sections: any[] = [];
  selectedSection: any = {};
  evaluationResults:any[] = [];
  answersAvailable: boolean = false
  answerCorrectness: string = ""
  isEvaluating: boolean = false;
  exlpainAnswer: boolean[] = [];



  private apiUrl = environment.apiUrl;
  
  constructor(private examService: ExamService, 
              private sanitizer: DomSanitizer,
              public dialog: MatDialog) {
    this.questionPaperUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.apiUrl);
  }

  

  ngOnInit(): void {    
    this.getPastQPapers()
  }

  getPastQPapers() {
    let user = localStorage.getItem('user')
    if (user) {
      const parsedUser = JSON.parse(user)
      this.examService.getPapers(parsedUser["schoolClass"], parsedUser["schoolBoard"]).subscribe(
        (response) => {
          this.subjects = response
        }
      )
    }
  }

  getPastPapersForSubject(subject: string){
    this.selectedSubject = subject
    this.showSubjectSelector = false
    this.showSubjectPaperSelector = true
    let user = localStorage.getItem('user')
    if (user) {
      const parsedUser = JSON.parse(user)
      this.examService.getPastPapersForSubject(parsedUser["schoolClass"], parsedUser["schoolBoard"], subject).subscribe(
        (response) => {
          response.forEach(file => {
            if (file.toLowerCase().endsWith('.pdf')) {
              this.questionPapers.push(file);
            } else if (file.toLowerCase().endsWith('.json')) {
              this.questionPaperJson.push(file);
            }            
          })
        }
      )
    }
  }

  getQuestionPaper(paperId: string){
    let user = localStorage.getItem('user')
    let self = this;
    if (user) {
      const parsedUser = JSON.parse(user)
      this.examService.fetchPaperPath(parsedUser["schoolClass"], parsedUser["schoolBoard"], this.selectedSubject, paperId).subscribe(
        (response: any) => {
          if (response != null) {
            self.currentPaperPath = response["paper_path"];

          }
          self.showSubjectPaperSelector = false;
          self.mockExamMode = true;
          self.selectedPaper = self.currentPaperPath
                    
          this.tempQuestionPaperUrl = this.apiUrl+"/question_paper/" + response["paper_path"];
          this.questionPaperUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.tempQuestionPaperUrl);
          self.examService.getAnswerSheet(parsedUser["schoolClass"], parsedUser["schoolBoard"], this.selectedSubject, paperId).subscribe(
            (response: any) => {
              this.sections = response["sections"];
              for (let i = 0; i < this.sections.length; i++) {
                let section = this.sections[i];
                if (i == 0) {
                  section['startingQuestionIndex'] = 0;
                } else {
                  section['startingQuestionIndex'] = this.sections[i - 1]['startingQuestionIndex'] + this.sections[i - 1]['numberOfQuestions'];
                }
              }
              this.selectedSection = this.sections[0];
            }
          )
        }
      )
    }
  }

  evaluate(){
    this.isEvaluating = true;
    let answersList = []

    for(let i = 0; i < this.answers.length-1; i++){
      let answer = {
        "questionNumber": i+1,
        "answer": this.answers[i+1]
      }
      answersList.push(answer)
    }

    this.examService.evaluate(this.currentPaperPath, answersList).subscribe(
      (results: any) => {        
        this.evaluationResults = results["results"]["results"]
        this.answersAvailable = true;
        this.isEvaluating = false;
      }
    )
  }

  sectionSelect(section: any){
    this.selectedSection = section;
  }

  closeExam(){
  }

  adjustHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = textarea.scrollHeight + 'px'; // Set new height
  }

  getAnswerForQuestion(questionNumber: Number){
    let result = this.evaluationResults.find(q => q.questionNumber === questionNumber);
    if(result == null){
      return 'Not Attempted'
    }

    let answerCorrectness = result["evaluation"]
    let answerExplanation = result["explaination"] || result["explanation"] || '';
    answerCorrectness = answerCorrectness.charAt(0).toUpperCase() + answerCorrectness.slice(1);

    return `<b>${answerCorrectness}</b><br>${answerExplanation}`;
  }

  explainAnswer(section: string, questionIndex: number){
    this.exlpainAnswer[questionIndex] = true;
  }
  
}
