const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkUserExists, generateAuthToken } = require("./Helper.js");

// api/users/

const register = async (req, res) => {
    try {
        var user = req.body;
        if (await checkUserExists(user.email)) {
            res.status(400).json({
                response: "User already registered.",
            });
        } else {
            var currentPassword = user.password;
            bcrypt.hash(currentPassword, 10, async (err, hash) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        response: "Internal server error.",
                    });
                } else {
                    const newUser = new User({
                        name: user.name,
                        email: user.email,
                        phonenumber: user.phonenumber,
                        password: hash,
                    });
                    await newUser.save();
                    res.status(200).json({
                        response: "User registered successfully.",
                        user: newUser,
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ response: "Internal server error." });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // first check if we have any account under this email

        const userExists = await checkUserExists(email);
        if(!userExists){
            // console.log("User not registered testing.");
            res.status(400).json({
                response: "User not registered.",
            });
        }
        else{
            // console.log("User registered testing.")
            const user = await User.findOne({ email: email });
            console.log(user);
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        response: "Internal server error.",
                    });
                } else if (result) {
                    const token = generateAuthToken(user);
                    res.status(200).json({
                        response: "User logged in successfully.",
                        token: token,
                        username: user.name,
                        user: user,
                    });
                } else {
                    res.status(400).json({ response: "Incorrect password." });
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ response: "Internal server error. from main catch" });
    }
};

module.exports = { register, login };

