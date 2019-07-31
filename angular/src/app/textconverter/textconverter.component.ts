import { SpeechService } from './../services/speech.service';
import { Component, OnInit } from '@angular/core';
import { File } from '../models/file';
import { variables } from '../app.variables';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-textconverter',
  templateUrl: './textconverter.component.html',
  styleUrls: ['./textconverter.component.scss']
})
export class TextconverterComponent implements OnInit {
  message: File = new File();
  version = 'version';
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
  editing = false;
  voices = ['Ivy', 'Joanna', 'Kendra', 'Kimberly', 'Salli', 'Joey', 'Justin', 'Matthew', 'Amy', 'Emma', 'Brian'];
  constructor(private speech: SpeechService) {}
  async addNote() {
    this.editing = false;
    // check if title and body are empty
    this.sameTitle = this.fileList.some(x => x.title === this.message.title);
    console.log(this.message);
    this.emptyTitle = this.isEmpty(this.message.title);
    this.emptyBody = this.isEmpty(this.message.message);
    // if they are not empty, API call
    if (!this.emptyBody && !this.emptyTitle && !this.sameTitle && this.message.voice.length > 0) {
      this.speech.postData(this.message).subscribe((data: File) => {
        // set done variable to true to show "message submitted"
        this.done = true;
        this.tempFile.version = data.version;
        // set the file name for this message to retrieve when calling getFiles()
        this.message.filePath = variables.s3Path + this.message.title.replace(/\s/g, '_') + this.tempFile.version + '.mp3';
        this.tempFile.filePath = this.message.filePath;
        this.tempFile.title = this.message.title;
        this.tempFile.message = this.message.message;
        this.tempFile.voice = this.message.voice;

        // update the list of files in UI by adding it to the TS array
        this.fileList.push(this.tempFile);
        // clear fields for temp object
        this.message.message = '';
        this.message.title = '';
        this.message.filePath = '';
        this.message.voice = '';
        this.tempFile = new File();
      });
      await this.delay(2000);
      this.done = false;
    }
  }



  ngOnInit() {
    this.getFiles();
    this.message.message = '';
    this.message.title = '';
    this.message.voice = '';

  }

  edit(file: File) {
    console.log(file);
    console.log(this.fileList);
    const index = this.findIndexOfTitle(this.fileList, file.title);
    console.log(index);
    this.speech.editNote(file).subscribe((data: File) => {
      console.log(this.fileList[index]);
      console.log(data.title);
      this.fileList[index] = new File();
      this.fileList[index].title = data.title;
      this.fileList[index].message = data.message;
      this.fileList[index].version = data.version;
      this.fileList[index].voice = data.voice;
      console.log(this.fileList[index]);
      // update.message = data.message;
      // update.version = data.version;
      this.fileList[index].filePath = variables.s3Path + data.title.replace(/ /g, '_') + data.version + '.mp3';
      console.log(this.fileList);
      this.clear();
    }, error => console.log(error));
  }

  clear() {
    this.editing = false;
    this.message.title = '';
    this.message.message = '';
    this.message.voice = '';
  }

  getFiles() {
    this.fileList = [];
    this.loading = true;
    this.speech.getFiles().subscribe((data: File[]) => {
      this.fileList = data[this.files];
      Array.prototype.forEach.call(this.fileList, file => {
          if (file.title !== 'Instructions') {
            file.filePath = variables.s3Path + file.title.replace(/ /g, '_') + file.version + '.mp3';
          } else {
            file.filePath = variables.s3Path + file.title.replace(/ /g, '_') + '0.mp3';
          }
        });
      this.initLoad = true;
      this.loading = false;
      console.log(this.fileList); }
      , error => console.log(error));
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
    this.editing = false;
    this.tempFile.title = file.title;
    this.tempFile.message = file.message;
    this.tempFile.title = this.tempFile.title.replace(/ /g, '_');
    this.loading = true;
    this.speech.deleteVoice(this.tempFile).subscribe((data: Array<object>) => {
      const index = this.fileList.indexOf(file);
      this.fileList.splice(index, 1);
      this.message.title = '';
      this.message.message = '';
      this.message.voice = '';
    }, error => console.log(error));
    this.loading = false;

  }

  getNoteDetails(file: File) {
    this.message.title = file.title;
    this.message.message = file.message;
    this.message.version = file.version;
    this.message.voice = file.voice;
    console.log(this.message);
    this.editing = true;
  }

  // simple delay function to delay "message submitted from disappearing."
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
  findIndexOfTitle(array: File[], title: string) {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i].title === title) {
            return i;
        }
    }
    return -1;
  }

}
