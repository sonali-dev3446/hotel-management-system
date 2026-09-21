import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { ReservationService } from '../../reservation/reservation.service';
import { Reservation } from '../../models/reservation';
import { DatePipe, JsonPipe } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterModule],
  templateUrl: './reservation-list.html',
  styleUrl: './reservation-list.css',
})
export class ReservationList {
  reservationService = inject(ReservationService);
  authService = inject(AuthService);

  // Stores original data received from API.
  // We never modify this.
  allReservations: Reservation[] = [];
  // Emits search text whenever user types.
  // This list is shown inside HTML.
  reservationList = signal<Reservation[]>([]);
  searchSubject = new Subject<string>();
  //Current search text
  searchTerm = '';
  selectedRoom = '';
  roomNumbers: number[] = [];
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    //searching
    this.loadReservations();

    this.searchReservation();
  }

    loadReservations() {
      this.reservationService.getReservations().subscribe({
        next: (data) => {
        
        // Save original data
        this.allReservations = data;
        // Show complete list initially
        this.reservationList.set(data);
        this.roomNumbers = [...new Set(data.map((x) => x.roomNumber))];
      },
          error: (err) => {
            console.log(err);
          },
    });
    }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    // Send search text into Subject(emit the subject)

    this.searchSubject.next(this.searchTerm);
  }

  fakeSearchApi(term: string) {
    term = term.toLowerCase();
    const filtered = this.allReservations.filter(
      (res) =>
        res.guestName.toLowerCase().includes(term) || res.roomNumber.toString().includes(term),
    );
    return of(filtered);
  }

  searchReservation() {
    this.searchSubject
      .pipe(
        // Wait 400 ms after typing stops
        debounceTime(400),
        // Ignore duplicate values
        distinctUntilChanged(),
        // Cancel previous search if user types again
        // switchMap(term=>this.fakeSearchApi(term))
      )

      .subscribe(() => {
        this.applyFilters();
      });
  }

  filterRoom(event: Event) {
    this.selectedRoom = (event.target as HTMLSelectElement).value;

    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allReservations];

    // Guest Search

    if (this.searchTerm) {
      filtered = filtered.filter((res) =>
        res.guestName

          .toLowerCase()

          .includes(this.searchTerm.toLowerCase()),
      );
    }

    // Room Filter

    if (this.selectedRoom) {
      filtered = filtered.filter((res) => res.roomNumber === Number(this.selectedRoom));
    }

    this.reservationList.set(filtered);
  }
 deleteReservation(id: any) {
  this.reservationService.deleteReservation(id).subscribe({
    next: () => {
  // Update original array
      this.allReservations = this.allReservations.filter(
        reservation => reservation._id !== id
      );

      // Update signal
      this.reservationList.set(this.allReservations);
      alert("Deleted Successfully");
    },
    error: err => {
      console.error(err);
    }
  });
}
}
