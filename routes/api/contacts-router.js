//routes/api/contacts-router.js
import express from "express";
import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} from "../../controllers/contactsController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, listContacts);

router.get("/:id", authenticateToken, getContactById);

router.post("/", authenticateToken, addContact);

router.delete("/:id", authenticateToken, removeContact);

export default router;
