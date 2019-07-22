import { Message } from './../models/message';
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
  postData(message: Message) {
    return this.http.post(variables.api, JSON.stringify(message));
  }
  getFiles() {
    return this.http.get(variables.api);
  }
  deleteVoice(file: File) {
    return this.http.delete(variables.api + '/' + file.title);
  }
}
