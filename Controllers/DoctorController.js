const DoctorService = require("../Services/DoctorService");

// Create doctor profile
const createDoctorProfile = async (req, res) => {
  try {

    const doctor = await DoctorService.createDoctorProfile(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: doctor
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorService.getAllDoctors();

    res.json({ success: true, data: doctors });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get My Doctor Profile
const getMyDoctorProfile = async (req, res) => {
  try {

    const doctor = await DoctorService.getDoctorByUserId(req.user._id);

    res.json({ success: true, data: doctor });

  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};


// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {

    const doctor = await DoctorService.updateDoctorProfile(
      req.user._id,
      req.body
    );

    res.json({ success: true, data: doctor });

  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};


// Delete Doctor Profile
const deleteDoctorProfile = async (req, res) => {
  try {

    await DoctorService.deleteDoctorProfile(req.user._id);

    res.json({ success: true, message: "Doctor deleted" });

  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDoctorProfile,
  getAllDoctors,
  getMyDoctorProfile,
  updateDoctorProfile,
  deleteDoctorProfile
};
