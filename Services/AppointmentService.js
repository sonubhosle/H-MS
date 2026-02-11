const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");


const createAppointment = async (userId, data) => {

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.role !== "PATIENT") {
    throw new Error("Only patients can book appointments");
  }

  const doctor = await Doctor.findById(data.doctor);
  if (!doctor) throw new Error("Doctor not found");

  // Prevent overlapping bookings
  const overlapping = await Appointment.findOne({
    doctor: data.doctor,
    startTime: { $lt: data.endTime },
    endTime: { $gt: data.startTime },
    status: { $in: ["pending", "confirmed"] }
  });

  if (overlapping) {
    throw new Error("Time slot already booked");
  }

  const appointment = await Appointment.create({
    user: userId,
    ...data
  });

  return appointment;
};

const getMyAppointments = async (userId) => {

  return await Appointment.find({
    user: userId,
    isDeleted: false
  })
    .populate("doctor")
    .sort({ startTime: -1 });
};



const getDoctorAppointments = async (doctorUserId) => {

  const doctor = await Doctor.findOne({ user: doctorUserId });
  if (!doctor) throw new Error("Doctor profile not found");

  return await Appointment.find({
    doctor: doctor._id,
    isDeleted: false
  })
    .populate("user", "-password")
    .sort({ startTime: -1 });
};



const updateAppointmentStatus = async (appointmentId, status) => {

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  appointment.status = status;
  await appointment.save();

  return appointment;
};



const cancelAppointment = async (appointmentId, reason) => {

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  appointment.status = "cancelled";
  appointment.cancellationReason = reason;
  await appointment.save();

  return appointment;
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment
};
