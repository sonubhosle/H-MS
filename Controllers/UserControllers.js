const UserService = require("../Services/UserService");
const JWT_PROVIDER = require("../config/JWT");
const { sendEmail } = require("../config/email");


const register = async (req, res) => {
  try {
        const photoUrl = req.file ? req.file.path : '';

    const { name, surname, mobile, email, password,role } = req.body;

    if (!name || !surname || !mobile || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserService.createUser({
      name,
      surname,
      mobile,
      email,
      password,
      photo: photoUrl,
      role
    });

    const jwt = JWT_PROVIDER.generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      jwt,
      user,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await UserService.loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};




const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const resetToken = await UserService.setResetPasswordToken(email);

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const html = `
      <p>You requested a password reset.</p>
      <p>Click this link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendEmail(email, "Reset Your Password", html);

    return res.status(200).json({
      success: true,
      message: "Reset password link sent to email",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and passwords are required",
      });
    }

    await UserService.resetPassword(token, newPassword, confirmPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};









const getUserProfile = async (req, res) => {
  try {
    const user = await UserService.findUserById(req.user._id);

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = req.file.path || req.file.filename;
    }

    // Remove empty fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        delete updateData[key];
      }
    });

    const updatedUser = await UserService.updateUserProfile(
      userId,
      updateData
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateProfile,
};
