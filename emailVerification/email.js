import nodemailer from "nodemailer";

// Gmail ke liye USER_MAIL aur USER_PASS (.env) configure karein.
// USER_PASS normal Gmail password nahi, Google App Password hona chahiye.
export const sendOTPEmail = async (email, otp) => {
  if (!process.env.USER_MAIL || !process.env.USER_PASS) {
    throw new Error("Email credentials missing. Please configure USER_MAIL and USER_PASS in .env");
  }

  const mailOptions = {
    from: `eCommerce Store <${process.env.USER_MAIL}>`,
    to: email,
    subject: "Your eCommerce Store Verification OTP",
    text: `Your email verification OTP is ${otp}. It will expire in 5 minutes. Do not share this code with anyone.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #111827;">Verify your email</h2>
        <p>Your eCommerce Store verification code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; padding: 16px 0;">${otp}</div>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
        <p style="color: #6b7280; font-size: 13px;">If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_PASS,
    },
  });

  return transporter.sendMail(mailOptions);
};
