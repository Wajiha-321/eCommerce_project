import userModel from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import { sendOTPEmail } from "../emailVerification/email.js";

// Register user and send a 6-digit OTP to the supplied email address.
const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered with this email",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = randomInt(100000, 1000000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = await userModel.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: passwordHash,
      otp,
      otpExpiry,
      isVerified: false,
    });

    try {
      await sendOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      // Email send na ho to incomplete registration database mein na rahe.
      await userModel.findByIdAndDelete(user._id);
      throw emailError;
    }

    return res.status(201).json({
      success: true,
      message: "Registration started. OTP has been sent to your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not register user or send OTP email",
      error: error.message,
    });
  }
};

// Verify the OTP received by email. Call this endpoint from Postman/Thunder Client.
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await userModel.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({ success: true, message: "Email is already verified" });
    }

    if (!user.otp || user.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please register again." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error.message);
    return res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

export { userRegister, verifyOTP };
