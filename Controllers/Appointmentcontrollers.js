const AppointmentService = require("../Services/AppointmentService");


// Book Appointment
const createAppointment = async (req, res) => {
  try {

    const appointment = await AppointmentService.createAppointment(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Patient Appointments
const getMyAppointments = async (req, res) => {
  try {

    const appointments = await AppointmentService.getMyAppointments(
      req.user._id
    );

    res.json({ success: true, data: appointments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Doctor Appointments
const getDoctorAppointments = async (req, res) => {
  try {

    const appointments =
      await AppointmentService.getDoctorAppointments(req.user._id);

    res.json({ success: true, data: appointments });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Update Status
const updateStatus = async (req, res) => {
  try {

    const appointment =
      await AppointmentService.updateAppointmentStatus(
        req.params.id,
        req.body.status
      );

    res.json({ success: true, data: appointment });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Cancel
const cancelAppointment = async (req, res) => {
  try {

    const appointment =
      await AppointmentService.cancelAppointment(
        req.params.id,
        req.body.reason
      );

    res.json({ success: true, data: appointment });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateStatus,
  cancelAppointment
};
