// In controllers/bookings.js
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const { get_available_cars, send_email, checkCarAvailability } = require("./Helper");

// /api/bookings/create
// COMPLETE
const bookCar = async (req, res) => {
    const { userID, username, email, carType, startTime, endTime, carNumber } = req.body;
    // console.log("userID", userID)
    if (!username || !email || !startTime || !endTime) {
        return res.status(400).json({
            error: "Please enter all the fields",
        });
    } 
    else {
        // If car number is given, check that exact car
        if (carNumber == null) {

            if (carType == null) {
                return res.status(400).json({
                    error: "Please enter a car type",
                });
            }

            // Get available cars
            let available_cars = await get_available_cars(
                startTime,
                endTime,
                carType
            );

            if (available_cars.length == 0) {
                return res.status(400).json({
                    error: "No cars available",
                });
            } else {
                // Pick the first car
                const carID = available_cars[0];

                // Get the Price of the car
                const car = await Car.findById(carID);
                const price = car.price;
                const numHours = Math.ceil((endTime - startTime) / 3600000);
                const totalPrice = price * numHours;

                // Create a new booking
                const booking = new Booking({
                    userID: userID,
                    carID: carID,
                    userName: username,
                    email: email,
                    bookingFrom: startTime,
                    bookingTo: endTime,
                    totalPrice: totalPrice,
                });

                // Save the booking
                await booking.save();

                // Populate and send the booking
                const populated_booking = await Booking.findById(
                    booking._id
                ).populate("carID");

                // SEND EMAIL TO USER REGARDING THE BOOKING
                // await send_email(populated_booking);

                res.status(200).json({
                    message: "Booking successful",
                    booking: populated_booking,
                });
            }
        } else {
            // carNumber is given, check that exact car

            // Get available cars
            let available_cars = await get_available_cars(
                startTime,
                endTime,
                carType
            );

            // get car with carNumber
            const car_wanted = await Car.findOne({ carNumber: carNumber });

            available_cars = available_cars.map((car_id) =>
                car_id.toString()
            );

            if (available_cars.includes(car_wanted._id.toString())) {
                // Book the car
                const carID = car_wanted._id;

                // Get the Price of the car
                const price = car_wanted.price;
                const numHours = Math.ceil((endTime - startTime) / 3600000);
                const totalPrice = price * numHours;

                // Create a new booking
                const booking = new Booking({
                    userID: userID,
                    carID: carID,
                    userName: username,
                    email: email,
                    bookingFrom: startTime,
                    bookingTo: endTime,
                    totalPrice: totalPrice,
                });

                // Save the booking
                await booking.save();

                // Populate and send the booking
                const populated_booking = await Booking.findById(
                    booking._id
                ).populate("carID");

                // SEND EMAIL TO USER REGARDING THE BOOKING
                await send_email(populated_booking);

                res.status(200).json({
                    message: "Booking successful",
                    booking: populated_booking,
                });
            } else {
                // Car not available
                res.status(400).json({
                    error: "Car not available",
                });
            }
        }
    }
};

// /api/bookings/all?carType=A&carNumber=101&startTime=t1&endTime=t2&id='xyz'
// COMPLETE
const getBookings = async (req, res) => {
    
    console.log("Finding Bookings...");
    // console.log(req.body)

    try {
        const { bookingId, carType, carNumber, startTime, endTime } = await req.query;
        const { userID } = await req.body;
        console.log(userID)

        if (bookingId) {
            // Find a single booking with a bookingId
            const booking = await Booking.findById(bookingId);

            // Populate the car
            const populated_booking = await Booking.findById(
                booking._id
            ).populate("carID");

            return res.status(200).json({
                booking: populated_booking,
            });
        } 
        else {

            let filters = {};
            // search by userID
            if (userID) {
                // filters.carID = {};
                filters.userID = userID;
            }

            if (startTime && endTime) {
                filters.bookingFrom = { $gte: startTime };
                filters.bookingTo = { $lte: endTime };
            }
            console.log("filters : ")
            console.log(filters)

            const bookings = await Booking.find(filters);

            let filtered_bookings = [];

            // Populate the cars
            for (let i = 0; i < bookings.length; i++) {
                
                const populated_booking = await Booking.findById(
                    bookings[i]._id
                ).populate("carID");

                // check if carType is given
                if (carType != null) {
                    // check if carType matches
                    if (populated_booking.carID.carType == carType) {
                        filtered_bookings.push(populated_booking);
                    }
                }
                // check if carNumber is given
                if (carNumber != null) {
                    // check if carNumber matches
                    if (populated_booking.carID.carNumber == carNumber) {
                        filtered_bookings.push(populated_booking);
                    }
                }

                if(carType == null && carNumber == null)
                    filtered_bookings.push(populated_booking);
            }
            console.log("Bookings found" + filtered_bookings);
            return res.status(200).json({
                filtered_bookings,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

// /api/bookings/update/:id
// COMPLETE
const updateBooking = async (req, res) => {

    const { email, username, startTime, endTime, carNumber } = req.body;
    // console.log(req.body);  
    
    // Get the booking with the given id
    // Check if the booking exists
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("carID");

    // if booking not found on that id
    if (!booking) {
        return res.status(400).json({
            error: "Booking not found",
        });
    }

    else {

        let final_val = {};
        
        if (email) {
            final_val.email = email;
        }
        else{
            final_val.email = booking.email;
        }

        if (username) {
            final_val.userName = username;
        }
        else{
            final_val.userName = booking.userName;
        }

        if (startTime) {
            final_val.bookingFrom = startTime;
        }
        else{
            final_val.bookingFrom = booking.startTime;
        }

        if (endTime) {
            final_val.bookingTo = endTime;
        }
        else{
            final_val.bookingTo = booking.endTime;
        }


        if (carNumber) {
            // Find Car ID
            // console.log("checking if car is available or not")
            const car = await Car.findOne({ carNumber: carNumber });
            
            if (!car) {
                // console.log("car not found")
                return res.status(400).json({
                    error: "Car not found",
                });
            }
            else
            {
                // console.log("car found")
                final_val.carID = car._id;
            }
        }
        else
        {
            final_val.carID = booking.carID;
        }
        // console.log(final_val)

        // Check if this booking is possible
        // Check car availability
        const isPossible = await checkCarAvailability(final_val.carID, final_val.bookingFrom, final_val.bookingTo, booking._id);

        if (!isPossible) {
            return res.status(400).json({
                error: "Car not available",
            });
        }

        // Update the booking
        await Booking.findByIdAndUpdate(id, final_val);

        // Populate and send the booking
        const populated_booking = await Booking.findById(id).populate("carID");

        return res.status(200).json({
            message: "Booking updated successfully",
            booking: populated_booking,
        });
    }
};

// /api/bookings/delete/:id
// COMPLETE
const deleteBooking = async (req, res) => {

    const { id } = req.params;

    try {
        // Find the booking with the given id
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(400).json({
                error: "Booking not found",
            });
        }

        // Delete the booking
        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            message: "Booking deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};


// /api/bookings/getRefundAmount/:id
// COMPLETE
const getRefundAmount = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            error: "Please enter the booking ID",
        });
    } else {
        try {
            // Find the booking with the given id
            const booking = await Booking.findById(id);

            if (!booking) {
                return res.status(400).json({
                    error: "Booking not found",
                });
            }

            // Calculate the refund amount
            const refundAmount = booking.getRefund();

            res.status(200).json({
                Refund: refundAmount,
            });
        } catch (error) {
            res.status(400).json({
                error: error.message,
            });
        }
    }
};

module.exports = {
    bookCar,
    updateBooking,
    deleteBooking,
    getBookings,
    getRefundAmount,
};
