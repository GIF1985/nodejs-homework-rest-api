//contactsController.js
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../helpers/index.js";
import Contact from "../models/contacts.js";
import {
  validateContactData,
  isValidEmail,
  isValidPhone,
} from "../validators/contactsValidator.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

export async function listContacts(req, res) {
  try {
    const contacts = await Contact.find({ owner: req.user._id });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getContactById(req, res) {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (contact && contact.owner.equals(req.user._id)) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function addContact(req, res) {
  const { name, email, phone } = req.body;
  const errors = validateContactData({ name, email, phone });

  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ errors: { email: "Invalid email" } });
    return;
  }

  if (!isValidPhone(phone)) {
    res.status(400).json({ errors: { phone: "Invalid phone number" } });
    return;
  }

  try {
    const newContact = await Contact.create({
      _id: uuidv4(),
      name,
      email,
      phone,
      owner: req.user._id,
    });
    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function removeContact(req, res) {
  const { id } = req.params;
  try {
    const removedContact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });
    if (removedContact) {
      res.json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
