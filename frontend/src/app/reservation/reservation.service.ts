import { inject, Injectable } from '@angular/core';
import { Reservation, ReservationResponse } from '../models/reservation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  authService = inject(AuthService);
private readonly apiUrl = 'http://localhost:5000/reservations';
      // token:string|null = null;

  constructor(private http: HttpClient) {
  }

  token(): string | null {
  return localStorage.getItem("token")
}
getReservations(): Observable<Reservation[]> {
  // const headers = new HttpHeaders({
  //   Authorization: `Bearer ${this.token()}`
  // });

  return this.http
    .get<ReservationResponse>(
      this.apiUrl    )
    .pipe(map(res => res.data));
}

getReservation(id: string): Observable<Reservation[]> {

  return this.http
    .get<ReservationResponse>(
      `${this.apiUrl}/${id}`    )
    .pipe(map(res => res.data));
}
  createReservation(
    reservation: Reservation
  ): Observable<Reservation> {

    return this.http.post<Reservation>(
      `${this.apiUrl}`,
      reservation
    );

  }

  updateReservation(
    id: string,
    reservation: Reservation
  ): Observable<Reservation> {
 
    return this.http.put<Reservation>(
      `${this.apiUrl}/${id}`,
      reservation
    );

  }

  deleteReservation(id: string): Observable<void> {
     
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}
 