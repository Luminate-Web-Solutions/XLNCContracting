import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://xlnccontracting.com/contact.php';

  constructor(private http: HttpClient) {}

  submitContactForm(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}