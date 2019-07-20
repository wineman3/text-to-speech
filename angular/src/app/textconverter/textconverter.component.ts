import { SpeechService } from './../services/speech.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  emptyTitle = false;
  emptyBody  = false;
  sameTitle = false;
  initLoad = false;
  constructor(private speech: SpeechService) {}

  addNote() {
    // check if title and body are empty
    this.sameTitle = this.fileList.some(x => x.title === this.message.title);

    this.emptyTitle = this.isEmpty(this.message.title);
    this.emptyBody = this.isEmpty(this.message.body);
    // if they are not empty, add them to the database
    if (!this.emptyBody && !this.emptyTitle && !this.sameTitle) {
      this.speech.postData(this.message).subscribe((data: Array<object>) => {
        // set done variable to true to show "message submitted"
        this.done = true;
        // set the file name for this message to retrieve when calling getFiles()
        this.message.FileName = variables.s3Path + this.message.title.replace(/\s/g, '_') + '.mp3';
        this.tempFile.filePath = this.message.FileName;
        this.tempFile.title = this.message.title;
        // update the list of files in UI by adding it to the TS array
        this.fileList.push(this.tempFile);
        // clear fields for temp object
        this.message.body = '';
        this.message.title = '';
        this.message.FileName = '';
        this.done = false;
        this.tempFile = new File();
        console.log(this.fileList);
      });
    }
  }

  ngOnInit() {
    this.getFiles();
    this.message.body = '';
    this.message.title = '';

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
      this.initLoad = true;
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
  isEmpty(input: string) {
    return (input.replace(/\s/g, '').length > 0 ? false : true);
  }

  deleteFile(file: File) {
    this.tempFile = file;
    this.tempFile.title = file.title.replace(/ /g, '_');
    this.loading = true;
    this.speech.deleteVoice(this.tempFile).subscribe((data: Array<object>) => {
      const index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
    }, error => console.log(error));
    this.loading = false;

  }

}