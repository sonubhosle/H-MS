const express = require("express");
const router = express.Router();

const PaymentController = require("../Controllers/PaymentControllers");
const Authenticate = require("../middleware/Authenticate");


router.post(
  "/payments/create-link/:appointmentId",
  Authenticate,
  PaymentController.createPaymentLink
);

router.get(
  "/payments/callback",
  PaymentController.handleCallback
);

module.exports = router;
