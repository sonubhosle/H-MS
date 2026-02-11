const AdminService = require("../services/AdminService");


// Approve Doctor
const approveDoctor = async (req, res) => {
  try {
    const user = await AdminService.approveDoctor(req.params.userId);

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully",
      data: user
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await AdminService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await AdminService.getAllDoctors();

    res.status(200).json({
      success: true,
      data: doctors
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Delete Doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await AdminService.deleteDoctor(req.params.doctorId);

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data: doctor
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AdminService.getAllAppointments();

    res.status(200).json({
      success: true,
      data: appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await AdminService.getAllPayments();

    res.status(200).json({
      success: true,
      data: payments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  approveDoctor,
  getAllUsers,
  getAllDoctors,
  deleteDoctor,
  getAllAppointments,
  getAllPayments
};
