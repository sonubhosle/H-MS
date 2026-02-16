const User = require("../models/User");
const bcrypt = require("bcrypt");
const JWT_PROVIDER = require("../config/JWT");
const crypto = require("crypto");


const createUser = async (userData) => {
  const { name, surname, email, password, photo, mobile, role } = userData;

  if (!name || !surname || !email || !password || !mobile) {
    throw new Error("All required fields must be provided");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Strong password validation
  const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      "Password must have at least 8 characters, one uppercase, one number and one symbol"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // ======================================================
  // 👑 ROLE + APPROVAL LOGIC
  // ======================================================

  let finalRole;
  let isApproved = true; // default approved

  // Super Admin Bootstrap
  if (normalizedEmail === process.env.SUPER_ADMIN_EMAIL) {
    finalRole = "ADMIN";
    isApproved = true;
  } else {
    const allowedRoles = ["PATIENT", "DOCTOR"];
    finalRole =
      role && allowedRoles.includes(role)
        ? role
        : "PATIENT";

    // Doctor must be approved by admin
    if (finalRole === "DOCTOR") {
      isApproved = false;
    }
  }

  const user = await User.create({
    name: name.trim(),
    surname: surname.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    photo,
    mobile,
    role: finalRole,
    isApproved,
  });

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  // 🚨 Doctor approval check
  if (user.role === "DOCTOR" && !user.isApproved) {
    throw new Error("Doctor account is not approved by admin");
  }

  const token = JWT_PROVIDER.generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    },
  };
};


const findUserByEmail = async (email) => {
  if (!email) throw new Error("Email is required");
  return await User.findOne({ email: email.toLowerCase().trim() });
};

const findUserById = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const user = await User.findById(userId).select("-password").populate('ratings').populate('reviews');
  if (!user) throw new Error("User not found");

  return user;
};



const getUserProfile = async (token) => {
  if (!token) throw new Error("Token required");

  const userId = JWT_PROVIDER.getUserIdFromToken(token);

  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("Account Not Found");

  return user;
};


const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ["name", "surname", "mobile", "photo", "email"];
  const updates = {};

  for (const key of allowedFields) {
    if (updateData[key]) {
      updates[key] = updateData[key];
    }
  }

  if (updates.email) {
    updates.email = updates.email.toLowerCase().trim();
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updates,
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};


const getAllUsers = async () => {
  return await User.find().select("-password").populate('ratings').populate('reviews');
}

const generateResetToken = () =>
  crypto.randomBytes(32).toString("hex");

const setResetPasswordToken = async (email) => {
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) throw new Error("Email not found");

  const resetToken = generateResetToken();

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

  await user.save();

  return resetToken;
};

const resetPassword = async (token, newPassword, confirmPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token");

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      "Password must contain 8+ characters, uppercase, number & symbol"
    );
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  return { message: "Password reset successful" };
};

module.exports = {
  createUser,
  loginUser,
  findUserByEmail,
  findUserById,
  getUserProfile,
  updateUserProfile,
  setResetPasswordToken,
  resetPassword,
  getAllUsers,
};
