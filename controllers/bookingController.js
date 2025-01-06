// controllers/bookingController.js
const path = require('path');
const Booking = require('../models/bookingModel');

// Add item to booking
exports.addToBooking = async (req, res) => {
  console.log(req.body);
  console.log(req.user);

  const {
    bikeId,
    description,
    bookingDate,
    bookingTime,
    bikeNumber,
  } = req.body;
  const id = req.user.id;

  // Check if all required fields are present
  if (
    !bikeId ||
    !description ||
    !bookingDate ||
    !bookingTime ||
    !bikeNumber
  ) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  try {
    //  Check if item is already in booking
    const itemInBooking = await Booking.findOne({
      bikeNumber: bikeNumber,
      status: 'pending',
    });

    if (itemInBooking) {
      // If item is already in booking, update the quantity
      return res.status(400).json({ message: 'Bike already in booking' });
    }

    // If item is not in booking, add it to booking
    const bookingItem = new Booking({
      bikeId: bikeId,
      description: description,
      bookingDate: bookingDate,
      bookingTime: bookingTime,
      bikeNumber: bikeNumber,
      userId: id,
    });

    await bookingItem.save();
    res.status(200).json({ message: 'Item added to booking' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all booking items
exports.getAllBookingItems = async (req, res) => {
  try {
    //  join booking with bikes
    const bookingItems = await Booking.find({})
      .populate('bikeId')
      .populate('userId');
    res.status(200).json({ bookings: bookingItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete item from booking
exports.deleteBookingItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  exports.getUsersWithAppointments = async (req, res) => {
    try {
      const users = await Booking.find({}).populate('userId');
      res.status(200).json({ users: users });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error,
      });
    }
  };
};

// Add item to booking with time slot validation
exports.addToBooking = async (req, res) => {
  console.log(req.body);
  console.log(req.user);

  const {
    bikeId,
    description,
    bookingDate,
    bookingTime,
    bikeNumber,
  } = req.body;
  const id = req.user.id;

  // Check if all required fields are present
  if (
    !bikeId ||
    !description ||
    !bookingDate ||
    !bookingTime ||
    !bikeNumber
  ) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check if the time slot is already booked
    const slotTaken = await Booking.findOne({
      bookingDate,
      bookingTime,
      status: 'pending'
    });

    if (slotTaken) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // If item is not in booking, add it to booking
    const bookingItem = new Booking({
      bikeId: bikeId,
      description: description,
      bookingDate: bookingDate,
      bookingTime: bookingTime,
      bikeNumber: bikeNumber,
      userId: id,
      status: 'pending'
    });

    await bookingItem.save();
    res.status(200).json({ message: 'Item added to booking' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

