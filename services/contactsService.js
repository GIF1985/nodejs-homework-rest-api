//services/contactsService.js
import Contact from "../models/contacts.js";

export async function getAllContacts(userId) {
  try {
    const contacts = await Contact.find({ owner: userId });
    return contacts;
  } catch (error) {
    console.error("Error getting contacts:", error);
    throw new Error("Failed to get contacts");
  }
}

export async function getContactById(contactId, userId) {
  try {
    const contact = await Contact.findOne({ _id: contactId, owner: userId });
    if (!contact) {
      throw new Error("Contact not found");
    }
    return contact;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
}

export async function createContact(userId, contactData) {
  try {
    const newContact = await Contact.create({
      ...contactData,
      owner: userId,
    });
    return newContact;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw new Error("Failed to create contact");
  }
}

export async function updateContact(contactId, userId, updateData) {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      updateData,
      { new: true }
    );
    if (!updatedContact) {
      throw new Error("Contact not found");
    }
    return updatedContact;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
}

export async function deleteContact(contactId, userId) {
  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      owner: userId,
    });
    if (!deletedContact) {
      throw new Error("Contact not found");
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}
