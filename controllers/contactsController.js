import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../helpers/index.js";
import Contact from "../models/contacts.js";

export async function listContacts(req, res) {
  try {
    const contacts = await Contact.find();
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
    if (contact) {
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
  if (!name || !email || !phone) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    const newContact = await Contact.create({
      id: uuidv4(),
      name,
      email,
      phone,
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
    const removedContact = await Contact.findByIdAndDelete(id);
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
