const PaymentService = require("../Services/PaymentService");



const createPaymentLink = async (req, res) => {
  try {

    const result = await PaymentService.createPaymentLink(
      req.params.appointmentId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Handle Razorpay Callback
// ========================================
const handleCallback = async (req, res) => {
  try {

    const result =
      await PaymentService.updatePaymentInformation(req.query);

    res.status(200).json(result);

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentLink,
  handleCallback,
};
