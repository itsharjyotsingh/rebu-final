const Booking = require("../models/Booking");
const Car = require("../models/Car");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// use dotenv
const dotenv = require("dotenv");
dotenv.config();

const get_available_cars = async (
    start_time,
    end_time,
    type_preference = null
) => {
    const bookings = await Booking.find({
        $or: [
            {
                $and: [
                    { bookedFrom: { $lte: start_time } },
                    { bookedTo: { $gte: start_time } },
                ],
            },
            {
                $and: [
                    { bookedFrom: { $lte: end_time } },
                    { bookedTo: { $gte: end_time } },
                ],
            },
        ],
    });

    const booked_cars = bookings.map((booking) => booking.carID);

    if (type_preference != null) {
        const available_cars = await Car.find({
            $and: [
                { _id: { $nin: booked_cars } },
                { carType: type_preference },
            ],
        });

        // Return IDs of available rooms if any are found
        return available_cars.map((car) => car._id);
    } else {
        const available_cars = await Car.find({
            _id: { $nin: booked_cars },
        });

        // Return IDs of available rooms
        return available_cars.map((car) => car._id);
    }
};

const checkCarAvailability = async (
    carID,
    startTime,
    endTime,
    bookingIdToIgnore = null
) => {
    const bookings = await Booking.find({
        $and: [
            { carID: carID },
            { _id: { $ne: bookingIdToIgnore } },
            {
                $or: [
                    {
                        $and: [
                            { bookingFrom: { $lte: startTime } },
                            { bookingTo: { $gte: startTime } },
                        ],
                    },
                    {
                        $and: [
                            { bookingFrom: { $lte: endTime } },
                            { bookingTo: { $gte: endTime } },
                        ],
                    },
                ],
            },
        ],
    });

    if (bookings.length == 0) {
        return true;
    } else {
        return false;
    }
};

const unix_time_to_date = (unix_time) => {
    const date = new Date(unix_time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    return `${day}/${month}/${year} ${hours}:${minutes.substring(
        minutes.length - 2
    )}:${seconds.substring(seconds.length - 2)}`;
};

const send_email = async (booking) => {
    const email = booking.email;
    const userName = booking.userName;
    const bookingFrom = unix_time_to_date(booking.bookingFrom);
    const bookingTo = unix_time_to_date(booking.bookingTo);
    const carNumber = booking.carID.carNumber;

    console.log("Sending email to: ", email);

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    // Create the email
    const mailOptions = {
        from: "apk.harsh.dev@gmail.com",
        to: email,
        secure: false,
        subject: "Booking Confirmed",
        text: `Hello ${userName},\n\nYour booking has been confirmed.\n\nRoom Number: ${carNumber}\nCheck In Time: ${bookingFrom}\nCheck Out Time: ${bookingTo}\n\nThank you for choosing us.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log("Email sent successfully");
        }
    });
};

const checkUserExists = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("error here")
        console.log(err);
        return false;
    }
};

const generateAuthToken = function (data) {
    data = JSON.stringify(data);
    const token = jwt.sign(data, "REBULOGINTOKENFORBROWSER", {
        // expiresIn:"30d",
    });
    return token;
};

// Export the function
module.exports = {
    get_available_cars,
    send_email,
    checkCarAvailability,
    checkUserExists,
    generateAuthToken,
};
