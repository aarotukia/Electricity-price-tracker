"use strict";
const mongoose = require("mongoose"),
  { Schema } = mongoose,
  Subscriber = require("./subscriber"),
  bcrypt = require("bcrypt"),
  passportLocalMongoose = require("passport-local-mongoose"),

  userSchema = new Schema(
    {
      name: {
        first: {
          type: String,
          trim: true
        },
        last: {
          type: String,
          trim: true
        }
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      zipCode: {
        type: Number,
        min: [1000, "Zip code too short"],
        max: 99999
      },
      phonenumber: {
        type: Number
    },
      courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
      subscribedAccount: {
        type: Schema.Types.ObjectId,
        ref: "Subscriber"
      }
    },
    {
      timestamps: true
    }
  );
    
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function(next) {
    let user = this;
    
    if (!user.isModified("password")) {
      return next();
    }
    
    bcrypt.hash(user.password, 10)
      .then(hash => {
        user.password = hash;
        next();
      })
      .catch(error => {
        console.log(`Error in hashing password: ${error.message}`);
        next(error);
      });
  });

  

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});
userSchema.pre("save", function(next) {
    let user = this;
    bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash;
    next();
    })
    .catch(error => {
   console.log(`Error in hashing password: ${error.message}`);
   next(error);
    });
   });
   userSchema.methods.passwordComparison = function(inputPassword){
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
   };


module.exports = mongoose.model("User", userSchema);