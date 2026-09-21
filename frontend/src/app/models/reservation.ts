export interface Reservation{

    _id?:string;

    guestName:string;

    guestEmail:string;

    roomNumber:number;

    roomType?:string;

    status?:string;

    price?:number;

    checkInDate:string;

    checkOutDate:string;

    userId:string;

}

export interface ReservationResponse{
    success:boolean;
    data:Reservation[];
}

export interface LoginResponse {

  status:number;

  message:string;

  token:string;

  data:User;

}

export interface User{

  id:string;

  firstName:string;

  lastName:string;

  email:string;
  hotelName: string;
  role:string;
  password: string;
  address: string;

}