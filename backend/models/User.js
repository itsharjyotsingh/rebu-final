const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    phonenumber: {
        type: Number,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        default: "user",
    }
});
const User = mongoose.model("User", userSchema);
module.exports = User;
