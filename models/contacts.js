import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

export async function addContact(name, email, phone) {
  try {
    const newContact = await Contact.create({ name, email, phone });
    return newContact;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    return contact || null;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function listContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

export async function removeContact(contactId) {
  try {
    const removedContact = await Contact.findByIdAndDelete(contactId);
    return removedContact || null;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function updateStatusContact(contactId, favorite) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    return updatedContact || null;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export default Contact;
