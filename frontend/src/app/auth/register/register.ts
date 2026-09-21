import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { passwordMatchValidator } from '../../shared/validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup = new FormGroup({});
  authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}
  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        hotelName: ['', Validators.required],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      {
        validators: passwordMatchValidator,
      },
    );
  }

  register() {
    if (this.registerForm.invalid) {
      // Mark every control as touched
      this.registerForm.markAllAsTouched();

      alert('Please fill all required fields correctly.');

      return;
    } else {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          alert('Registration Successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(err.message);
        },
      });
    }
  }
}
