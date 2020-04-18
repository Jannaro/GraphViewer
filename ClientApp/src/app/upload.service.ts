import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from  '@angular/common/http';  
import { map } from  'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  SERVER_URL: string = "Files"; 
  constructor(private httpClient: HttpClient, @Inject('BASE_URL') baseUrl: string) { 
    this.serverUrl = baseUrl + this.SERVER_URL;
    console.log(baseUrl);
  }

  public upload(formData: FormData) {

    return this.httpClient.post<any>(this.serverUrl, formData, {  
        reportProgress: true,  
        observe: 'events'  
      });  
  }
  
  serverUrl: string;
}
