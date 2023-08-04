//usersService.js
export function validateContactData(contactData) {
  const { name, email, phone } = contactData;
  const errors = {};

  if (!name) {
    errors.name = "Name is required";
  }

  if (!email) {
    errors.email = "Email is required";
  }

  if (!phone) {
    errors.phone = "Phone is required";
  }

  return errors;
}

export function isValidEmail(email) {
  return email.includes("@");
}

export function isValidPhone(phone) {
  return /^\d{7,15}$/.test(phone);
}
