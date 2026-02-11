const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");


// ✅ Approve Doctor
const approveDoctor = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  if (user.role !== "DOCTOR") {
    throw new Error("User is not a doctor");
  }

  user.isApproved = true;
  await user.save();

  return user;
};


// ✅ Get All Users
const getAllUsers = async () => {
  return await User.find().select("-password");
};


// ✅ Get All Doctors
const getAllDoctors = async () => {
  return await Doctor.find({ isDeleted: false })
    .populate("user", "-password");
};


// ✅ Soft Delete Doctor
const deleteDoctor = async (doctorId) => {
  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { isDeleted: true, isActive: false },
    { new: true }
  );

  if (!doctor) throw new Error("Doctor not found");

  return doctor;
};


// ✅ Get All Appointments
const getAllAppointments = async () => {
  return await Appointment.find()
    .populate("user", "name email")
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name email" }
    });
};


// ✅ Get All Payments
const getAllPayments = async () => {
  return await Payment.find()
    .populate({
      path: "appointment",
      populate: [
        { path: "patient", select: "name email" },
        { path: "doctor" }
      ]
    });
};


module.exports = {
  approveDoctor,
  getAllUsers,
  getAllDoctors,
  deleteDoctor,
  getAllAppointments,
  getAllPayments
};
