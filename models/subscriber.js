const mongoose = require("mongoose");
//Defining a schema for subscribers
const subscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    zipCode: {
        type: Number,
        min: [10000, "Zip code too short"],
        max: 99999
    },
    phonenumber: {
        type: Number
    },
    vip: {
        type: Boolean,
        required: true
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});


//exprt model for subscriber schema 
module.exports = mongoose.model("Subscriber", subscriberSchema);


subscriberSchema.methods.getInfo = function () {
    return `Name: ${this.name} Email: ${this.email} Zip Code:
    ${this.zipCode}  Phone Number:
    ${this.phonenumber}`;
};


subscriberSchema.methods.findLocalSubscribers = function () {
    return this.model("Subscriber").find({ zipCode: this.zipCode })
        .exec();
};



