import { File } from './../models/file';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { variables } from '../app.variables';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  options: {};
  constructor(private http: HttpClient) {

  }
  postData(file: File) {
    return this.http.post(variables.api, JSON.stringify(file));
  }
  getFiles() {
    return this.http.get(variables.api);
  }
  deleteVoice(file: File) {
    return this.http.delete(variables.api + '/' + file.title);
  }
  editNote(file: File) {
    return this.http.put(variables.api + '/' + file.title, JSON.stringify(file));
  }
}
