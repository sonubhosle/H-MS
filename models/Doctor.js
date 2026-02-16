const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },

    specialty: {
      type: String,
      required: true,
      index: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    hospital: {
      name: String,
      address: String,
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
    },

    availability: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        startTime: String,
        endTime: String,
      },
    ],
    ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratings",  
    }
  ],

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",   
    }
  ],

  numRatings: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },


    isActive: {
      type: Boolean,
      default: true,
    },
      isDeleted: {
  type: Boolean,
  default: false
},
  },


  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("doctors", doctorSchema);
module.exports = Doctor;
