import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { HttpError } from "../helpers/index.js";
import { v4 as uuidv4 } from "uuid";
import jimp from "jimp";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import {
  sendVerificationEmail,
  generateAvatarURL,
} from "../helpers/emailUtils.js";

export async function registerUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const avatarURL = generateAvatarURL(email);

    const user = await User.create({
      email,
      password: hashedPassword,
      subscription: "starter",
      avatarURL,
      verificationToken,
    });

    const token = generateToken(user._id);

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function logoutUser(req, res) {
  res.status(200).json({ message: "Logout successful" });
}

export async function getCurrentUser(req, res) {
  try {
    res.status(200).json({
      user: {
        email: req.user.email,
        subscription: req.user.subscription,
        avatarURL: req.user.avatarURL,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function updateUserAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uniqueFilename = `${uuidv4()}${path.extname(req.file.originalname)}`;

  try {
    const avatar = await jimp.read(req.file.buffer);
    await avatar.cover(250, 250).write(`./tmp/${uniqueFilename}`);

    fs.renameSync(
      `./tmp/${uniqueFilename}`,
      `./public/avatars/${uniqueFilename}`
    );

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatarURL = `/avatars/${uniqueFilename}`;
    await user.save();

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

function generateToken(userId) {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export async function resendVerificationEmail(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Missing required field email" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    await sendVerificationEmail(email, user.verificationToken);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function verifyUserEmail(req, res) {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
