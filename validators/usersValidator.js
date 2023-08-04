//usersValidator.js
export function validateUserData(userData) {
  const { email, password } = userData;
  const errors = {};

  if (!email) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

export function isValidEmail(email) {
  return email.includes("@");
}

export function isValidPassword(password) {
  return password.length >= 6;
}
