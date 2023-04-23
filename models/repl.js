const mongoose = require("mongoose");
const dbURL = "mongodb://127.0.0.1:27017/recipe_db";
const Course = require("./course");
const Subscriber = require("./subscriber");
const User = require("./user");

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000
}).then(() => {
    console.log("Successfully connected to MongoDB!");
    User.create({
        name: {
            first: "test112323er",
            last: "yes s112323ir"
        },
        email: "yesyes112323yes@course.com",
        password: "pass12341123231235"
    }).then(user => {
        var targetSubscriber;
        testUser = user;
        console.log("Username: ", testUser.username);
        User.findById(testUser._id)
        .populate('subscribedAccount')
        .populate('courses')
        .then(user => {
            console.log("User ID: ", user._id);
            console.log("Name: ", user.name);
            console.log("Email: ", user.email);
            console.log("Subscribed account: ", user.subscribedAccount);
            console.log("Courses: ", user.courses);
            console.log("username: ", user.username);
            console.log("fullname: ", user.fullName);
        })
        .catch(error => {
            console.error(error);
        })})});
    
      
      
