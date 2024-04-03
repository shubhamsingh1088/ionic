import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  postData(data: any): Observable<any> {
    const url = `${this.apiUrl}/save-document`;
    const headers = this.getHeaders();

    return this.http.post(url, data, { headers });
  }

  fetchData(): Observable<any> {
    const url = `${this.apiUrl}/get-documents`;
    const headers = this.getHeaders();

    return this.http.get(url, { headers });
  }

  getUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/get-document/${userId}`;
    const headers = this.getHeaders();

    return this.http.get(url, { headers });
  }

  editUser(userId: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/update-document/${userId}`;
    const headers = this.getHeaders();

    return this.http.put(url, data, { headers });
  }

  deleteUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/delete-document/${userId}`;
    const headers = this.getHeaders();

    return this.http.delete(url, { headers });
  }

  checkUserLogin(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/authenticateUsers`;
    const headers = this.getHeaders();
    const userData = { email: email, password: password };

    return this.http.post(url, userData, { headers });
  }

}
