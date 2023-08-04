//// routes/index.js
import express from "express";
import contactsRouter from "./api/contacts-router.js";
import usersRouter from "./api/users-router.js";

const router = express.Router();

router.use("/api/contacts", contactsRouter);
router.use("/api/users", usersRouter);

export default router;
