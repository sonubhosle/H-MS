const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");
const razorpay = require("../Config/Payment");


const createPaymentLink = async (appointmentId, userId) => {

  const appointment = await Appointment.findById(appointmentId)
    .populate("user");

  if (!appointment) throw new Error("Appointment not found");

  // Only patient who booked can pay
  if (appointment.user._id.toString() !== userId.toString()) {
    throw new Error("Not authorized to pay for this appointment");
  }

  if (appointment.paymentStatus === "paid") {
    throw new Error("Appointment already paid");
  }

  const mobile =
    appointment.user.mobile &&
    String(appointment.user.mobile).length === 10
      ? String(appointment.user.mobile)
      : "9999999999";

  const paymentLink = await razorpay.paymentLink.create({
    amount: appointment.price * 100,
    currency: "INR",
    customer: {
      name: `${appointment.user.name} ${appointment.user.surname}`,
      email: appointment.user.email,
      contact: mobile,
    },
    notify: { sms: true, email: true },
    reminder_enable: true,
    callback_url: `http://localhost:8585/api/hms/payments/callback?appointmentId=${appointmentId}`,
    callback_method: "get",
  });

  // Save payment in DB
  await Payment.create({
    appointment: appointmentId,
    amount: appointment.price,
    transactionId: paymentLink.id,
    paymentMethod: "ONLINE",
    status: "PENDING",
  });

  return {
    paymentLinkId: paymentLink.id,
    paymentUrl: paymentLink.short_url,
  };
};



const updatePaymentInformation = async (query) => {

  const {
    razorpay_payment_id,
    razorpay_payment_link_id,
    razorpay_payment_link_status,
    appointmentId,
  } = query;

  if (!appointmentId)
    throw new Error("Appointment ID missing in callback");

  if (razorpay_payment_link_status !== "paid") {
    return { success: false, message: "Payment not completed" };
  }

  // Update Payment record
  await Payment.findOneAndUpdate(
    {
      appointment: appointmentId,
      transactionId: razorpay_payment_link_id,
    },
    {
      transactionId: razorpay_payment_id,
      status: "COMPLETED",
    }
  );

  // Update Appointment
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");

  appointment.paymentStatus = "paid";
  appointment.status = "confirmed";

  await appointment.save();

  return { success: true, message: "Payment successful" };
};

module.exports = {
  createPaymentLink,
  updatePaymentInformation,
};
