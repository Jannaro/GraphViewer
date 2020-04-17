import { Component, ViewChild, ElementRef } from '@angular/core';

class FileData {
  constructor(file: File) {
    let self = this;
    this.file = file;
    this.reader = new FileReader();
    this.reader.onload = function(event) {
      self.data = event.target.result;
      console.log("File contents: " + self.data);
    };
    this.reader.onerror = function(event) {
      console.error("File could not be read! Code " + event.target.error.code);
    };
  }
  readAsArrayBuffer() : void {
    this.reader.readAsArrayBuffer(this.file);
  }
  readAsDataURL() : void {
    this.reader.readAsDataURL(this.file);
  }
  readAsText() : void {
    this.reader.readAsText(this.file);
  }

  private file: File;
  private data: any; // ArrayBuffer
  private reader: FileReader;
  private inProgress = false;
  private progress: 0
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    this.workingDir = "";
  }
  ngOnInit() {
  }
  selectWorkDir(): void {
    console.log("Button clicked!");
  }
  onFilesDropped(fileList: FileList): void {
    console.log("FileList: " + fileList);
    for (let i = 0; i < fileList.length; i++) {
      this.files.push(new FileData(fileList[i]));
    }
    this.uploadFiles();  
  }
  onUploadClick() : void {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {  
      for (let index = 0; index < fileUpload.files.length; index++)  
      {  
        this.files.push(new FileData(fileUpload.files[index]));   
      }  
      this.uploadFiles();  
    };  
    fileUpload.click();  
  }

  private uploadFiles() { 
    for(let file of this.files) {
      file.readAsDataURL(); 
    }

  } 


  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;

  title = 'Statistica graphs viewer';
  workingDir: string;
  files: FileData[] = [];
}
