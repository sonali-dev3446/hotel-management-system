import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../../models/reservation';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  loginForm: FormGroup = new FormGroup({});
  registerUser: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required]],

      remember: [false],
    });
  }

  login() {
    // const user = JSON.parse(localStorage.getItem('registeredUser') || {});
    const email = this.loginForm.value.email.trim();
    const password = this.loginForm.value.password.trim();
    if (this.loginForm.invalid) {
      console.log('invalid');
      return;
    } else {
    this.authService.login(email, password).subscribe({
  next: (res) => {

    localStorage.setItem("token", res.token);

    localStorage.setItem(
      "user",
      JSON.stringify(res.user)
    );

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    this.router.navigate(["/dashboard"]);

  },

  error: (err) => {

    alert(err.error.message);

  }
});
    }
  }
}
