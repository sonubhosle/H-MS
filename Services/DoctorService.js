const Doctor = require("../models/Doctor");
const User = require("../models/User");

// Create Doctor Profile
const createDoctorProfile = async (userId, doctorData) => {

  // Check user exists
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Only DOCTOR role allowed
  if (user.role !== "DOCTOR") {
    throw new Error("User is not authorized as Doctor");
  }

  // Check doctor profile already exists
  const existingDoctor = await Doctor.findOne({ user: userId });
  if (existingDoctor) {
    throw new Error("Doctor profile already exists");
  }

  const doctor = await Doctor.create({
    user: userId,
    ...doctorData
  });

  return doctor;
};

// Get All Doctors
const getAllDoctors = async () => {
  return await Doctor.find()
    .populate("user", "-password");
};

// Get Doctor By User Id
const getDoctorByUserId = async (userId) => {

  const doctor = await Doctor.findOne({ user: userId })
    .populate("user", "-password");

  if (!doctor) throw new Error("Doctor profile not found");

  return doctor;
};

// Update Doctor Profile
const updateDoctorProfile = async (userId, updateData) => {

  const doctor = await Doctor.findOneAndUpdate(
    { user: userId },
    updateData,
    { new: true }
  ).populate("user", "-password");

  if (!doctor) throw new Error("Doctor profile not found");

  return doctor;
};

// Delete Doctor Profile
const deleteDoctorProfile = async (userId) => {
  const doctor = await Doctor.findOneAndUpdate(
    { user: userId },
    { isDeleted: true },
    { new: true }
  );

  if (!doctor) throw new Error("Doctor profile not found");

  return doctor;
};


module.exports = {
  createDoctorProfile,
  getAllDoctors,
  getDoctorByUserId,
  updateDoctorProfile,
  deleteDoctorProfile
};
