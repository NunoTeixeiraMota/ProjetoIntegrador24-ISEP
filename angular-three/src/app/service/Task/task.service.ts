import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user'; 
import { API_CONFIG } from 'config';
import { MessageService } from '../message/message.service';
import taskVigilance from 'src/app/model/taskVigilance';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiBaseUrl = API_CONFIG.apiBaseUrlAuth; 

  constructor(private http: HttpClient, private messageService: MessageService) { }

  vigilance(task: taskVigilance): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(`${this.apiBaseUrl}/Task/vigilance`, task, httpOptions);
  }
}