// services/usersService.js
import User from "../models/users.js";
import bcrypt from "bcrypt";
import { HttpError } from "../helpers/index.js";
import { v4 as uuidv4 } from "uuid";
import {
  sendVerificationEmail,
  generateAvatarURL,
} from "../helpers/emailUtils.js";

export async function createUser(userData) {
  try {
    const { email, password } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError(409, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const avatarURL = generateAvatarURL(email);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      subscription: "starter",
      avatarURL,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new HttpError(500, "Failed to create user");
  }
}

export async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new HttpError(500, "Failed to get user by ID");
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new HttpError(500, "Failed to get user by email");
  }
}

export async function updateUser(userId, updateData) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      throw new HttpError(404, "User not found");
    }
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new HttpError(500, "Failed to update user");
  }
}

export async function deleteUser(userId) {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new HttpError(404, "User not found");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new HttpError(500, "Failed to delete user");
  }
}
