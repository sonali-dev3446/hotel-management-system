import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../../models/reservation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reservation-form.html',
  styleUrl: './reservation-form.css',
})
export class ReservationForm {
  reservationService = inject(ReservationService);
  reservationForm: FormGroup = new FormGroup({});
  submitted = false;
  reservationCurrentId: string | null = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.reservationForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', [Validators.required, Validators.minLength(3)]],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', [Validators.required]],
    });
    this.reservationCurrentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.reservationCurrentId) {
      this.reservationService.getReservation(this.reservationCurrentId).subscribe((reservation) => {
        if (reservation) {
          this.reservationForm.patchValue(reservation);
        }
      });
    }
  }
  onSubmit() {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();

    }

    this.submitted = true;
    let reservation: Reservation = this.reservationData();
// Don't send _id for new reservation
delete reservation._id;
    if (this.reservationCurrentId) {
      // update reservation

      this.reservationService
        .updateReservation(this.reservationCurrentId, reservation)
        .subscribe((res) => alert('Record Updated!'));
                  this.router.navigate(['/list']);

    } else {
      //new reservation
      this.reservationService.createReservation(reservation).subscribe({
        next: (res) => {
          console.log('Created:', res);
          alert('Reservation created successfully');
          this.reservationForm.reset();

          this.router.navigate(['/list']);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  reservationData() {
      const loggedInUser = JSON.parse(localStorage.getItem('user')!);

    const reservation: Reservation = {
    _id: crypto.randomUUID(),

    userId: loggedInUser.id,

    guestName: this.reservationForm.value.guestName,
    guestEmail: this.reservationForm.value.guestEmail,

    roomNumber: this.reservationForm.value.roomNumber,

    checkInDate: this.reservationForm.value.checkInDate,

    checkOutDate: this.reservationForm.value.checkOutDate
};
return reservation;
  }
}
