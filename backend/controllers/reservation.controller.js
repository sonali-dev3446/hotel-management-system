import Reservation from "../models/Reservation.js";

export const createReservation = async (req, res) => {
  try {

    const reservation = await Reservation.create({
      ...req.body,
      userId: req.user.userID
    });

    return res.status(201).json({
      success: true,
      data: reservation
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const getReservations = async (req, res) => {
  try {

    console.log("Decoded Token:", req.user);

    const reservations = await Reservation.find({
      userId: req.user.userID
    });

    console.log("Reservations:", reservations);

    return res.status(200).json({
      success: true,
      data: reservations
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const getReservation = async (req, res) => {
  try {

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.userID
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: reservation
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const updateReservation = async (req, res) => {
  try {

    const reservation = await Reservation.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userID
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: reservation
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const deleteReservation = async (req, res) => {
  try {

    const reservation = await Reservation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userID
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully"
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};