import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      role,
      password,
      address,
      dob,
      gender,
      city,
      country,
      hotelName
    } = req.body;
    // check exixting user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User alerady exists",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create User
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
      address,
      dob,
      gender,
      city,
      country,
      hotelName
    });
    //not returning password to user
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "Registration Successful",

      data: userResponse,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
export const login = async (req, res) => {
  try {
     // Read data from request body
    const { email, password } = req.body;
    // check exixting user
    const existingUser = await User.findOne({email});
    console.log(existingUser)
    if (!existingUser) {
      return res.status(  404).json({
        message: "User Not exists",
      });
    }
    // Encrypt password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userID: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
    );
    const user = existingUser.toObject();

    delete user.password;

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      token: token,
      user,
    });
  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).send(err.message);
  }
};
export const profile = async (req, res) => {
  try {
// User ID comes from JWT Middleware
    const user = await User.findById(req.user.userID).select("-password");
//.select("-password"):not sending the password to frontend so to remove password in the res
      if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
     return res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    console.log("ERROR:", err);
    return res.status(500).send(err.message);
  }
};
