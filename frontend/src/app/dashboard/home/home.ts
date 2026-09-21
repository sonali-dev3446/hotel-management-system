import { DatePipe, DecimalPipe } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';
import { Reservation, User } from '../../models/reservation';
import { ReservationService } from '../../reservation/reservation.service';
import { AuthService } from '../../auth/auth.service';
import { BaseChartDirective } from 'ng2-charts';

import {
  Component,
  computed,
  inject,
  signal,
  ViewChildren,
  QueryList
} from '@angular/core';

  import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
imports: [
  BaseChartDirective,
  
],  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @ViewChildren(BaseChartDirective)
charts!: QueryList<BaseChartDirective>;
  reservationService = inject(ReservationService);

  allReservations = signal<Reservation[]>([]);
totalRooms = signal(100);
  pricePerNight = 3500;
  constructor(private router: Router,
      private cdr: ChangeDetectorRef

  ) {}
  ngOnInit() {
    this.loadReservations();
  }

loadReservations() {

  this.reservationService.getReservations().subscribe({

    next: (data) => {
      this.allReservations.set(data);

      setTimeout(() => {

        this.updateCharts();

        this.charts?.forEach(chart => {
         
          chart.update();

        });

      });

    },

    error: console.error

  });

}

occupiedRooms = computed(() => {

  const occupied = this.allReservations()

    .filter(r=>r.status==="Checked In")

    .map(r=>r.roomNumber);

  return new Set(occupied).size;

});

availableRooms = computed(() => {
  return this.totalRooms() - this.occupiedRooms();
});

totalReservations = computed(() => {
  return this.allReservations().length;
});
     
todayCheckIns = computed(() => {

  const today = new Date().toDateString();

  return this.allReservations().filter(res =>

    new Date(res.checkInDate).toDateString() === today

  ).length;

});

todayCheckOuts = computed(() => {

  const today = new Date().toDateString();

  return this.allReservations().filter(res =>

    new Date(res.checkOutDate).toDateString() === today

  ).length;

});

upcomingReservations = computed(() => {

  const today = new Date();

  return this.allReservations()

    .filter(res => new Date(res.checkInDate) > today)

    .sort((a, b) =>
      new Date(a.checkInDate).getTime() -
      new Date(b.checkInDate).getTime()
    )

    .slice(0, 5);

});

revenue = computed(() => {

  return this.allReservations().reduce(

    (sum, r) => sum + (r.price ?? 0),

    0

  );

});
occupancyChartData: ChartConfiguration<'doughnut'>['data'] = {
  
  labels: ['Occupied', 'Available'],

  datasets: [

    {

      data: [0, 0],

      backgroundColor: [

        '#3b82f6',

        '#22c55e'

      ]

    }

  ]

};

// Doughnut chart

doughnutOptions: ChartOptions<'doughnut'> = {

  responsive: true,
  maintainAspectRatio: false,

  plugins: {

    legend: {

      position: 'bottom'

    }

  }

};

//bar chart
reservationChartData: ChartConfiguration<'bar'>['data'] = {

labels:[
'Jan',
'Feb',
'Mar',
'Apr',
'May',
'Jun',
'Jul',
'Aug',
'Sep',
'Oct',
'Nov',
'Dec'
],

  datasets: [

    {

      label: 'Reservations',

      data: [0, 0, 0, 0, 0, 0],

      backgroundColor: '#3b82f6'

    }

  ]

};

barOptions: ChartOptions<'bar'> = {

  responsive: true,
    maintainAspectRatio: false

};

//Revenue 
revenueChartData: ChartConfiguration<'line'>['data'] = {

  labels: [

    'Jan',

    'Feb',

    'Mar',

    'Apr',

    'May',

    'Jun'

  ],

  datasets: [

    {

      label: 'Revenue',

      data: [0, 0, 0, 0, 0, 0],

      borderColor: '#10b981',

      fill: false

    }

  ]

};

lineOptions: ChartOptions<'line'> = {

  responsive: true,
    maintainAspectRatio: false


};

//pie chart

roomChartData: ChartConfiguration<'pie'>['data'] = {

  labels: [

    'Single',

    'Double',

    'Suite'

  ],

  datasets: [

    {

      data: [0, 0, 0],

      backgroundColor: [

        '#3b82f6',

        '#f97316',

        '#8b5cf6'

      ]

    }

  ]

};

pieOptions: ChartOptions<'pie'> = {

  responsive: true,
    maintainAspectRatio: false


};

updateCharts() {

  const reservations = this.allReservations();

  // -------------------------------
  // Occupancy Chart
  // -------------------------------

  this.occupancyChartData = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [
          this.occupiedRooms(),
          this.availableRooms()
        ],
        backgroundColor: ['#3b82f6', '#22c55e']
      }
    ]
  };



  // -------------------------------
  // Room Distribution
  // -------------------------------

  const single = reservations.filter(r => r.roomType === 'Single').length;

  const double = reservations.filter(r => r.roomType === 'Double').length;

  const suite = reservations.filter(r => r.roomType === 'Suite').length;

  this.roomChartData = {
    labels: ['Single', 'Double', 'Suite'],
    datasets: [
      {
        data: [
          single,
          double,
          suite
        ],
        backgroundColor: [
          '#3b82f6',
          '#f97316',
          '#8b5cf6'
        ]
      }
    ]
  };



  // -------------------------------
  // Monthly Reservation Count
  // -------------------------------

  const monthlyReservations = Array(12).fill(0);

  reservations.forEach(r => {

    const month = new Date(r.checkInDate).getMonth();

    monthlyReservations[month]++;

  });

  this.reservationChartData = {

    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],

    datasets: [
      {
        label: 'Reservations',
        data: monthlyReservations,
        backgroundColor: '#3b82f6'
      }
    ]

  };



  // -------------------------------
  // Monthly Revenue
  // -------------------------------

  const monthlyRevenue = Array(12).fill(0);

  reservations.forEach(r => {

    const month = new Date(r.checkInDate).getMonth();

    monthlyRevenue[month] += r.price ?? 0;

  });

  this.revenueChartData = {

    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],

    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue,
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        tension: 0.4,
        fill: false
      }
    ]

  };
setTimeout(() => {

  this.charts?.forEach(chart => chart.update());

});


this.cdr.detectChanges();
}
logout() {
   localStorage.removeItem("token");

   localStorage.removeItem("user");
  localStorage.clear();
   this.router.navigate(['/login']);
  this.router.navigate(['/login'])
}
}
