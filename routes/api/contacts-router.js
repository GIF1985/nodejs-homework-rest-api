import express from "express";
import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} from "../../controllers/contactsController.js";
import { someMiddleware } from "../../middleware/someMiddleware.js";

const router = express.Router();

// Маршрут для получения списка всех контактов
router.get("/", listContacts);

// Маршрут для получения контакта по его ID
router.get("/:id", getContactById);

// Маршрут для добавления нового контакта
router.post("/", someMiddleware, addContact);

// Маршрут для удаления контакта по его ID
router.delete("/:id", removeContact);

export default router;
