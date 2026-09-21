import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
    hotelName: {
    type: String
  },
  role: String,
  password: String,
  address: String,
  dob: Date,
  gender: String,
  city: String,
  country: String
});

const User = mongoose.model("User", userSchema);

export default User;