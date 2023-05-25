const express = require('express');
const router = express.Router();

const { bookCar, getBookings, updateBooking, deleteBooking, getRefundAmount } = require('../controllers/BookingController.js');

router.post('/all', getBookings); // Search Params will be used
router.get('/getRefundAmount/:id', getRefundAmount);
router.post('/create', bookCar);
router.post('/update/:id', updateBooking);
router.delete('/delete/:id', deleteBooking);

module.exports = router;