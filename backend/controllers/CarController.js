const Car = require("../models/Car");

// /api/cars/create?carType=XYZ
// COMPLETE
const getAllCars = async (req, res) => {
    if (req.query.carType != null) {
        const cars = await Car.find({
            carType: req.query.carType,
        });

        res.status(200).json({
            cars,
        });
    } else {
        const cars = await Car.find();

        res.status(200).json({
            cars,
        });
    }
};

// api/cars/create
// COMPLETE
const createCar = async (req, res) => {
    
    const { carType, carNumber, price } = req.body;

    if (carType == null || carNumber == null || price == null) {
        return res.status(400).json({
            error: "Fill all the fields",
        });
    } 
    else {
        
        try {

            const car = new Car({
                carType: carType,
                carNumber: carNumber,
                price: price,
            });

            await car.save();

            res.status(200).json({
                message: "Car created successfully",
                car,
            });

        } catch (error) 
        {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

// api/cars/delete/:id
// COMPLETE
const deleteCar = async (req, res) => {
    
    const carID = req.params.id;
    // Check if there is a car with the given ID
    const car = await Car.findById(carID);

    if (car == null) {
        return res.status(400).json({
            error: "No car with the given ID",
        });
    } else {
        try {
            await Car.findByIdAndDelete(carID);
            res.status(200).json({
                message: "Car deleted successfully",
            });
        } catch (error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

// api/cars/delete_by_number/:carNumber
// COMPLETE
const deleteCarByNumber = async (req, res) => {

    const carNumber = req.params.carNumber;

    // Check if there is a car with the given car number
    const car = await Car.findOne({
        carNumber: carNumber,
    });

    if (car == null) {
        return res.status(400).json({
            error: "No car exists with the given car number",
        });
    } else {
        try {
            await Car.findByIdAndDelete(car._id);
            res.status(200).json({
                message: "Car deleted successfully",
            });
        } catch (error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

module.exports = {
    getAllCars,
    createCar,
    deleteCar,
    deleteCarByNumber,
};
