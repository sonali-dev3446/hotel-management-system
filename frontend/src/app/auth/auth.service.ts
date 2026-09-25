import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoginResponse, User } from '../models/reservation';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'http://localhost:5000/auth'; //base url from mockoon
  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) {}

 login(email: string, password: string) {
  return this.http.post<any>(
    `${this.apiUrl}/login`,
    {
      email,
      password
    }
  );
}
  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/register', user);
  }
        //Load only current user's reservations

 getCurrentUser(): User {
  return JSON.parse(localStorage.getItem('user')!);
}
getAuthToken(): string | null {
  return localStorage.getItem("token")
}
  profile(): Observable<User> {
const token =  this.getAuthToken();

  // const headers = new HttpHeaders({
  //   Authorization: `Bearer ${token}`
  // });
    return this.http.get<LoginResponse>(`${this.apiUrl}/profile`)
    .pipe(map((res) => res.data));
  }
}
