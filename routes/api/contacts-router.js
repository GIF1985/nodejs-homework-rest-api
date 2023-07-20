import express from "express";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateStatusContact,
} from "../../models/contacts.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await getContactById(id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  try {
    const newContact = await addContact(name, email, phone);
    if (newContact) {
      res.status(201).json(newContact);
    } else {
      res.status(500).json({ message: "Failed to add contact" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removedContact = await removeContact(id);
    if (removedContact) {
      res.json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.patch("/:contactId/favorite", async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (!favorite) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await updateStatusContact(contactId, { favorite });

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
