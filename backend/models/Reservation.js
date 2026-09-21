import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({

    guestName: String,

    guestEmail: String,

    roomNumber: Number,

    roomType: {
        type: String,
        enum: ["Single","Double","Suite"]
    },

    price: Number,

    status: {
        type: String,
        enum:["Booked","Checked In","Checked Out","Cancelled"],
        default:"Booked"
    },

    checkInDate: Date,

    checkOutDate: Date,

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{
    timestamps:true
});
export default mongoose.model("Reservation", reservationSchema);