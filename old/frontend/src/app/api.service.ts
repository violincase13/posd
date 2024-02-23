import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { SenderReceiver } from './sender_receiver';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  // SIMPLE GET ACTIONS
  getPatients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients`);
  }

  getPatient(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients/${email}`);
  }

  getDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctors`);
  }

  getMessages(): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages`);
  }

  checkUserCredentials(email: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http.get(`${this.baseUrl}/patients/login`, {params});
  }

  // MORE COMPLICATED GET ACTIONS

  /*getMessagesBetweenUsers(senderAndReceiver: SenderReceiver): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages`, senderAndReceiver);
  }*/

  getMedicalRecordsForPatient(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/medicalRecords/${email}`);
  }

  getPrescriptionsForPatient(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/prescriptions/${email}`);
  }

  // CREATE USER

  createUser(firstName: string, lastName: string, username: string,
                email: string, password: string, role: string): Observable<any> {
    const user = {
      firstName,
      lastName,
      username,
      email,
      password,
      role
    };
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  // SEND NEW MESSAGE

  sendNewMessage(sender: string, receiver: string, text: string): Observable<any> {
    const message = {
      sender,
      receiver,
      text
    };
    return this.http.post(`${this.baseUrl}/send`, message);
  }

   // GET MESSAGES WITH PATIENT

  getMessagesWithPatient(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages/${email}`);
  }


  /*
  updatePatient(email: string, patient: Patient): Observable<any> {
    return this.http.put(`${this.baseUrl}/patients/${email}`, patient);
  }

  deletePatient(email: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/patients/${email}`);
  }
  */
}
