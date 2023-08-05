// routes/api/users-router.js

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserAvatar,
  resendVerificationEmail,
  verifyUserEmail,
} from "../../controllers/usersController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";
import { uploadMiddleware } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticateToken, getCurrentUser);

router.patch(
  "/avatars",
  authenticateToken,
  uploadMiddleware.single("avatar"),
  updateUserAvatar
);

router.post("/verify/resend", resendVerificationEmail);
router.get("/verify/:verificationToken", verifyUserEmail);

export default router;
