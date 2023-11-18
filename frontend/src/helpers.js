// these functions are used multiple times to validate data

// the email address is validated against the standard format of emails
export const emailValidator = (email) => {
  const re =
    /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
  if (re.test(email)) {
    return true;
  } else {
    return false;
  }
};

// the password should contain a capital letter, a small letter, a number, and a special character and has to 6 or more characters
export const passwordValidator = (password) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (re.test(password)) {
    return true;
  } else {
    return false;
  }
};
