
const Rating = require ("../models/Rating.js");
const Doctor = require ("../models/Doctor.js");
const User = require ("../models/User.js");
const createRating = async (data, user) => {
  if (!data) throw new Error("Request body missing");

  const { doctorId, rating } = data;

  if (!doctorId) throw new Error("doctorId is required");

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("doctor not found");

  // Prevent duplicate rating
  const alreadyRated = await Rating.findOne({
    user: user._id,
    doctor: doctorId,
  });

  if (alreadyRated) {
    throw new Error("You have already rated this doctor");
  }

  // Create the rating
  const newRating = await Rating.create({
    user: user._id,
    doctor: doctorId,
    rating,
  });

  // 1. Update DOCTOR's ratings
  doctor.ratings.push(newRating._id);
  doctor.numRatings = doctor.ratings.length;
  await doctor.save();

  // 2. Update USER's ratings (THIS IS MISSING)
  const userDoc = await User.findById(user._id);
  userDoc.ratings.push(newRating._id);
  await userDoc.save();

  // Populate and return
  return await newRating.populate({
    path: "user",
    select: "-password"
  });
};

const getAllRatings = async (doctorId) => {
  const query = { doctor: doctorId };

  return Rating.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

const updateRating = async (ratingId, userId, value) => {
  if (value < 1 || value > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const rating = await Rating.findById(ratingId);
  if (!rating) throw new Error("Rating not found");

  if (rating.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  rating.rating = value;
  await rating.save();

  return rating;
};

 const deleteRating = async (ratingId, userId) => {
    try {
      const rating = await Rating.findById(ratingId);
      
      if (!rating) {
        throw new Error("Rating not found");
      }

      // Check ownership
      if (rating.user.toString() !== userId.toString()) {
        throw new Error("You can only delete your own ratings");
      }

      // Remove from doctor
      await Doctor.findByIdAndUpdate(rating.doctor, {
        $pull: { ratings: ratingId },
        $inc: { numRatings: -1 }
      });

      // Remove from user
      await User.findByIdAndUpdate(userId, {
        $pull: { ratings: ratingId }
      });

      // Delete rating
      await Rating.findByIdAndDelete(ratingId);

      return { message: "Rating deleted successfully" };

    } catch (error) {
      throw error;
    }
  }




module.exports = {
  createRating,
  getAllRatings,
  updateRating,
  deleteRating
};