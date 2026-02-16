
const Review = require ("../models/Reviews.js");
const User = require ("../models/User.js");
const Doctor = require("../models/Doctor.js");

const createReview = async (data, user) => {
  const { doctorId,  description } = data;

  if (!description) throw new Error("Review description is required");

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");


  const review = await Review.create({
    user: user._id,
    doctor: doctor._id,
    description,
  });

  doctor.reviews.push(review._id);
  doctor.numReviews = doctor.reviews.length;
  await doctor.save();

  await User.findByIdAndUpdate(user._id, {
    $push: { reviews: review._id },
  });

  return review.populate("user", "name email");
};

const getAllReviews = async (doctorId) => {
  const query = { doctor: doctorId };

  return Review.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

const updateReview = async (reviewId, userId, description) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (review.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  review.description = description ?? review.description;
  await review.save();

  return review.populate("user", "name email");
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (review.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  await Doctor.findByIdAndUpdate(review.doctor, {
    $pull: { reviews: review._id },
    $inc: { numReviews: -1 },
  });

  await User.findByIdAndUpdate(userId, {
    $pull: { reviews: review._id },
  });

  await Review.findByIdAndDelete(reviewId);
  return { message: "Review deleted successfully" };
};

module.exports =  {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
