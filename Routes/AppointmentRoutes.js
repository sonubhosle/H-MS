const express = require("express");
const router = express.Router();

const AppointmentController = require("../Controllers/Appointmentcontrollers");
const Authenticate = require("../middleware/Authenticate");
const authorizeRoles = require("../middleware/authorize");

// Patient books appointment
router.post(
  "/appointments/book",
  Authenticate,
  authorizeRoles("PATIENT"),
  AppointmentController.createAppointment
);

// Patient view own appointments
router.get(
  "/appointments/my",
  Authenticate,
  authorizeRoles("PATIENT"),
  AppointmentController.getMyAppointments
);

// Doctor view their appointments
router.get(
  "/appointments/doctor",
  Authenticate,
  authorizeRoles("DOCTOR"),
  AppointmentController.getDoctorAppointments
);

// Doctor update status
router.put(
  "/appointments/:id/status",
  Authenticate,
  authorizeRoles("DOCTOR"),
  AppointmentController.updateStatus
);

// Cancel appointment (Patient + Doctor allowed)
router.put(
  "/appointments/:id/cancel",
  Authenticate,
  authorizeRoles("PATIENT", "DOCTOR"),
  AppointmentController.cancelAppointment
);

module.exports = router;
