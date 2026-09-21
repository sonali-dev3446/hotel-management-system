import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/reservation';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink, DatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  



  authService = inject(AuthService);
  currentTime = signal(new Date());
  userFirstName = signal('');

  userLastName = signal('');
  hotelName = signal('');
  token: string | null = null;
  
  constructor(private router: Router) {}
  ngOnInit() {

    this.token = this.authService.getAuthToken();
    this.authService.profile().subscribe({
      next: (res) => {
        if (res) {
          this.userFirstName.set(res.firstName);
          this.userLastName.set(res.lastName);

          this.hotelName.set(res.hotelName);
        }
        setInterval(() => {
          this.currentTime.set(new Date());
        }, 1000);
        // this.loadProfile();

        setInterval(() => {
          this.currentTime.set(new Date());
        }, 1000);
      },

      error: (err) => {
        console.log('Error:', err);
      },
    });
  }


  logout() {
    localStorage.clear();

    this.router.navigate(['/login']);
  }
}
