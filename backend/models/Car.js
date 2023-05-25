const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    carNumber: {
        type: Number,
        required: true,
        unique: true
    },
    carType: {
        type: String,
        required: true,
    },
    // Hourly
    price: {
        type: Number,
        required: true,
    }
});

const Car = mongoose.model("Car", carSchema);
module.exports = Car;

