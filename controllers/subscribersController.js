const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber");
const users = require("./usersController");


//subscribers controller
exports.getAllSubscribers = (req, res) => {
    Subscriber.find({})
    .exec()
    .then((subscribers) => {
        res.render("subscribers", {
        subscribers: subscribers
        });
         })
         .catch((error) => {
        console.log(error.message);
        return [];
         })
         .then(() => {
        console.log("promise complete");
         });
        };

  exports.getSubscriptionPage = (req, res) => {
    res.render("contact.ejs");
  };
  exports.saveSubscriber = (req, res) => {
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode,
      phonenumber: req.body.phonenumber,
      vip: req.body.vip === "check" ? true : false
    });
  
    newSubscriber.save()
      .then(() => {
        res.render("thanks");
      })
      .catch((error) => {
        res.send(error);
      });
  };