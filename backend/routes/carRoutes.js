const express = require('express');
const router = express.Router();

const { createCar, deleteCar, getAllCars, deleteCarByNumber } = require('../controllers/CarController.js');

// BASE: /api/rooms/
router.get('/all', getAllCars); // Search Params will be used
router.post('/create', createCar); // Create a room
router.delete('/delete/:id', deleteCar); // delete by ID
router.delete('/deleteByNumber/:carNumber', deleteCarByNumber); // delete by room number

module.exports = router;