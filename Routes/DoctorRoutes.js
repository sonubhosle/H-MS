const express = require("express");
const router = express.Router();

const DoctorController = require("../Controllers/DoctorController");
const Authenticate = require("../Middleware/Authenticate");
const authorize =  require('../Middleware/authorize')
// Create Doctor Profile
router.post(
  "/doctor/create",
  Authenticate,
  authorize("DOCTOR"),
  DoctorController.createDoctorProfile
);
// Get All Doctors
router.get("/doctor/all", DoctorController.getAllDoctors);

// Get My Doctor Profile
router.get("/doctor/me", Authenticate, DoctorController.getMyDoctorProfile);

// Update Doctor Profile
router.put("/doctor/update", Authenticate, DoctorController.updateDoctorProfile);

// Delete Doctor Profile
router.delete("/doctor/delete", Authenticate, DoctorController.deleteDoctorProfile);

module.exports = router;
