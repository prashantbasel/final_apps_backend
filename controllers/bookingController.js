const Booking = require('../models/bookingModel');

// Add item to booking
exports.addToBooking = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Authenticated User:', req.user);

  const { contactNumber, bookingDate, bookingTime, bikeNumber } = req.body;
  const id = req.user.id;

  // Check if all required fields are present
  if (!contactNumber || !bookingDate || !bookingTime || !bikeNumber) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check if the time slot is already booked
    const slotTaken = await Booking.findOne({
      bookingDate,
      bookingTime,
      status: 'pending',
    });

    if (slotTaken) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Add the booking
    const bookingItem = new Booking({
      contactNumber,
      bookingDate,
      bookingTime,
      bikeNumber,
      userId: id,
      status: 'pending',
    });

    await bookingItem.save();
    res.status(200).json({ message: 'Booking added successfully' });
  } catch (error) {
    console.error('Error in addToBooking:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all booking items
exports.getAllBookingItems = async (req, res) => {
    try {
        const bookingItems = await Booking.find({}).populate('userId'); // Replace 'Booking' with your model if needed
        res.status(200).json({ bookings: bookingItems });
    } catch (error) {
        console.error('Error fetching booking items:', error.message);
        res.status(500).json({ error: 'Failed to fetch booking items' });
    }
};


// Delete item from booking
const mongoose = require('mongoose');

exports.deleteBookingItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid booking ID format' });
    }

    const deletedItem = await Booking.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



