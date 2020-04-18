import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { UploadService } from  './upload.service';
/*
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
}*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private uploadService: UploadService) {
  }
  ngOnInit() {
  }
  selectWorkDir(): void {
    console.log("Button clicked!");
  }
  onFilesDropped(fileList: FileList): void {
    console.log("FileList: " + fileList);
    for (let i = 0; i < fileList.length; i++) {
      this.filesToUpload.push(fileList[i]);
    }
    this.uploadFiles();  
  }

  onUploadClick() : void {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {  
      for (let index = 0; index < fileUpload.files.length; index++)  
      {  
        this.filesToUpload.push(fileUpload.files[index]);   
      }  
      this.uploadFiles();  
    };  
    fileUpload.click();  
  }

  private uploadFiles() { 
    this.fileUpload.nativeElement.value = '';  
    this.filesToUpload.forEach(file => {  
      this.uploadFile(file);  
    });
  }

  uploadFile(file) {  
    if(~this.filesToDisplay.findIndex((element: File) => 
        element.name == file.name && element.size == file.size 
                 && element.lastModified == file.lastModified)) {
      return;
    }
    let self = this;
    const formData: any = new FormData();  
    formData.append('file', file);  
    file.inProgress = true;  
    this.uploadService.upload(formData).pipe(  
      map(event => {  
        switch (event.type) {  
          case HttpEventType.UploadProgress:  
            file.progress = Math.round(event.loaded * 100 / event.total);  
            break;  
          case HttpEventType.Response:  
            return event;  
        }  
      }),  
      catchError((error: HttpErrorResponse) => {  
        file.inProgress = false;  
        let pos = self.filesToUpload.indexOf(file);
        if(pos != -1) {
          self.filesToUpload.splice(pos, 1);
        }
        return of(`${file.name} upload failed.`);  
      })).subscribe((event: any) => {  
        if (typeof (event) === 'object') {  
          console.log(event.body); 
          if(event.body[0] != file.name) {
            alert("Unexpected file name!")
          }
          delete file.inProgress;
          delete file.progress;
          self.filesToDisplay.push(file); 
          let pos = self.filesToUpload.indexOf(file);
          if(pos != -1) {
            self.filesToUpload.splice(pos, 1);
          }
        }  
      });  
  }


  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;

  title = 'Statistica graphs viewer';
  filesToUpload: File[] = [];
  filesToDisplay: File[] = [];
}
