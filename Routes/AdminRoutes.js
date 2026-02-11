const express = require("express");
const router = express.Router();

const Authenticate = require("../Middleware/Authenticate");
const authorizeRoles = require("../Middleware/authorize");
const AdminController = require("../Controllers/AdminController");

router.use(Authenticate, authorizeRoles("ADMIN"));

router.put("/approve-doctor/:userId", AdminController.approveDoctor);
router.get("/users", AdminController.getAllUsers);
router.get("/doctors", AdminController.getAllDoctors);
router.put("/doctor/delete/:doctorId", AdminController.deleteDoctor);
router.get("/appointments", AdminController.getAllAppointments);
router.get("/payments", AdminController.getAllPayments);

module.exports = router;
