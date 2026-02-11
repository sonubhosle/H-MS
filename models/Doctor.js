const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
