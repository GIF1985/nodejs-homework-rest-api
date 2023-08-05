//emailUtils.js
import { v4 as uuidv4 } from "uuid";
import gravatar from "gravatar";
import nodemailer from "nodemailer";
import { HttpError } from "../helpers/index.js";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export async function sendVerificationEmail(email, verificationToken) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "ghub3090@gmail.com",
        pass: jwtSecret,
      },
    });

    const mailOptions = {
      from: "ghub3090@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `
        <p>Hello,</p>
        <p>Thank you for registering. Please click the link below to verify your email:</p>
        <a href="http://localhost:3000/api/users/verify/${verificationToken}">Verify Email</a>
        <p>Best regards,</p>
        <p>Maksym</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new HttpError(500, "Failed to send verification email");
  }
}

export function generateAvatarURL(email) {
  const avatar = gravatar.url(email, { s: "250", d: "identicon" }, true);
  return avatar.replace("http:", "https:");
}
