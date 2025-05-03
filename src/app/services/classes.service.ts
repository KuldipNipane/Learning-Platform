import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    let uuid = localStorage.getItem('uuid')
  }

  private uuid = localStorage.getItem('uuid');


  classesData: any[] = [];

  private apiUrl = environment.apiUrl;

  getSubjectsInfo(board: string, className: string){
    return this.http.get<any[]>(this.apiUrl+'/material/subjects/'+board+'/'+className)
  }

  getChapters(board: string, className: string, subject: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl+'/material/chapters/'+board+'/'+className+"/"+subject)
  }

  getChapter(board: string, className: string, subject: string, chapter: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl+'/material/text/'+board+'/'+className+"/"+subject+"/"+chapter)
  }

  getClassData(param1: string): Observable<any> {
    const params = new HttpParams()
      .set('class_info', param1)
    return this.http.get(this.apiUrl+"/class_data", { params });
  }

  getQuizData(class_info: string): Observable<any> {
    const formData = new FormData();
    formData.append('class_info', class_info);
    return this.http.post(this.apiUrl+"/quiz", formData, {})
  }

  getChatQueryResponse(chatQuery: string, classId: string): Observable<any> {
    const formData = new FormData();
    formData.append('chat_query', chatQuery);
    formData.append('class_id', classId);

    if (this.uuid) {
      formData.append('uuid', this.uuid);
    }
    return this.http.post(this.apiUrl+"/chat", formData, {})
  }


  getTeachmeQueryResponse(chatQuery: string, chatStyle: any ,classId: string): Observable<any> {
    const formData = new FormData();
    formData.append('chat_query', chatQuery);
    formData.append('chat_style', JSON.stringify(chatStyle));
    formData.append('class_id', classId);

    if (this.uuid) {
      formData.append('uuid', this.uuid);
    }
    return this.http.post(this.apiUrl+"/material/teachme", formData, {})
  }

  getConverseResponse(chatQuery: string, chatStyle: any ,classId: string): Observable<any> {
    const formData = new FormData();
    formData.append('chat_query', chatQuery);
    formData.append('chat_style', JSON.stringify(chatStyle));
    formData.append('class_id', classId);

    if (this.uuid) {
      formData.append('uuid', this.uuid);
    }
    return this.http.post(this.apiUrl+"/converse", formData, {})
  }

  getConceptMaps(schoolBoard: string, schoolClass: string, classId: string, subject: string): Observable<any> {
    return this.http.get(this.apiUrl+"/material/concept_map/"+schoolBoard+"/"+schoolClass+"/"+subject +"/"+classId,  {})
  }

  getImages(query: string): Observable<any> {
    const params = new HttpParams()
    .set('image_query', query);
    return this.http.get(this.apiUrl+"/image_results",  {params})
  }

  getLearningAudio(schoolBoard: string,classId: string, subject: string, chapter: string): Observable<any> {
    const params = new HttpParams()
    return this.http.get(this.apiUrl+"/material/audio/"+schoolBoard+"/"+classId+"/"+subject +"/"+chapter,  {})
  }

  getLearningAudioFile(filePath: string): Observable<any> {
    const params = new HttpParams()
    .set('file_path', filePath);
    return this.http.get(this.apiUrl+"/material/get_audio",  {params})
  }
}
