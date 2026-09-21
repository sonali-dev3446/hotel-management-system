import { Routes } from '@angular/router';
import { Home } from './dashboard/home/home';
import { ReservationList } from './reservation/reservation-list/reservation-list';
import { ReservationForm } from './reservation/reservation-form/reservation-form';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { Navbar } from './shared/navbar/navbar';

export const routes: Routes =
 [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  {
    path: '',
    component: Navbar,
    children: [
      {
        path: 'dashboard',
        component: Home,
      },
      {
        path: 'list',
        component: ReservationList,
      },
      {
        path: 'new-reservation',
        component: ReservationForm,
      },
      { path: 'edit/:id', component: ReservationForm },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
