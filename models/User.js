const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter Your Name"],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "Enter Your Surname"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Enter Your Mobile No"],
    },
    email: {
      type: String,
      required: [true, "Enter Your Email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Enter Your Password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "ADMIN"],
      default: "PATIENT",
    },
    photo: {
      type: String,
    },
    isApproved: {
  type: Boolean,
  default: false
},
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "ratings" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews" }],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
        createdAt:{
        type:Date,
        default:Date.now()
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
