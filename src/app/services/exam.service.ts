import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment'
import { json } from 'd3';
@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  getPapers(schoolClass: string, schoolBoard: string){
    return this.http.get<any[]>(`${this.apiUrl}/question_papers/${schoolClass}/${schoolBoard}`);
  }

  getPastPapersForSubject(schoolClass: string, schoolBoard: string, subject: string){
    return this.http.get<any[]>(`${this.apiUrl}/question_papers_subject/${schoolClass}/${schoolBoard}/${subject}`);
  }

  fetchPaperPath(schoolClass: string, schoolBoard: string, subject: string, paperId: string){
    return this.http.get<any[]>(`${this.apiUrl}/question_paper_path/${schoolClass}/${schoolBoard}/${subject}/${paperId}`);
  }

  getAnswerSheet(schoolClass: string, schoolBoard: string, subject: string, paperId: string){
    return this.http.get<any[]>(`${this.apiUrl}/answer_sheet/${schoolBoard}/${schoolClass}/${subject}/${paperId}`);
  }

  evaluate(paper_path: string, answers: any[]) {
    const formData = new FormData();
    formData.append('question_paper', paper_path);
    formData.append('answers', JSON.stringify(answers));
    return this.http.post(`${this.apiUrl}/evaluate_paper`, formData);
  }

  explainQuestion(questionaperPath: string, section: string, questionNumber: number){
    const formData = new FormData();
    formData.append('question_paper_path', questionaperPath);
    formData.append('section', section);
    formData.append('question_number', String(questionNumber));
    return this.http.post(`${this.apiUrl}/explain_question`, formData); 
  }

  doubtChat(chatStyle: any, questionaperPath: string, section: string, questionNumber: number, query: string){
    const formData = new FormData();
    formData.append('question_paper_path', questionaperPath);
    formData.append('section', section);
    formData.append('question_number', String(questionNumber));
    formData.append('query', query);
    return this.http.post(`${this.apiUrl}/exam_doubt`, formData); 
  }
}