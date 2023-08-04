// routes/api/users-router.js

import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserAvatar,
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

export default router;
