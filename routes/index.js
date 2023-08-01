// index.js
import express from "express";
import contactsRouter from "./api/contacts-router.js";
import usersRouter from "./api/users-router.js";

const router = express.Router();

router.use("/contacts", contactsRouter);
router.use("/users", usersRouter);

export default router;
