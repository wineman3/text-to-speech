import { SpeechService } from './../services/speech.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { File } from '../models/file';
import { variables } from '../app.variables';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-textconverter',
  templateUrl: './textconverter.component.html',
  styleUrls: ['./textconverter.component.scss']
})
export class TextconverterComponent implements OnInit {
  message: Message = new Message();
  body = 'body';
  done = false;
  audio = new Audio();
  fileList: File[] = [];
  files = 'files';
  tempFile = new File();
  tempIndex;
  playing = false;
  loading = true;
  constructor(private speech: SpeechService) {}

  addNote() {
    this.speech.postData(this.message).subscribe((data: Array<object>) => {
      console.log(this.message);
      this.done = true;
      this.message.FileName = this.message.title.replace(/\s/g, '') + '.mp3';
      this.getFiles();
     });
  }

  ngOnInit() {
    this.getFiles();

  }

  edit(file: File) {
    this.message.title = file.title;
  }

  getFiles() {
    this.fileList = [];
    this.loading = true;
    this.speech.getFiles().subscribe((data: Array<object>) => {
      data[this.files].forEach((file) => {
        if (!this.fileList.includes(file)) {
          this.tempFile.filePath = variables.s3Path + file;
          this.tempIndex = file.indexOf('.mp3');
          this.tempFile.title = file.substr(0, this.tempIndex);
          console.log(this.tempFile.title);
          this.tempFile.title = this.tempFile.title.replace(/_/g, ' ');
          console.log(this.tempFile.title);
          this.fileList.push(this.tempFile);
          this.tempFile = new File();
        }
      });
      this.loading = false;
    });
  }
  playAudio(filePath: string) {
    this.audio.src = filePath;
    this.audio.load();
    this.audio.play();
  }

  pauseAudio() {
    this.audio.pause();
  }

  deleteFile(file: File) {
    file.title = file.title.replace(/ /g, '_');
    this.loading = true;
    this.speech.deleteVoice(file).subscribe((data: Array<object>) => {
      this.getFiles();
    }, error => console.log(error));

  }

}
