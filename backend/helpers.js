// these functions are used multiple times to validate data

// the email address is validated against the standard format of emails
export const emailValidator = (email) => {
  const re =
    /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
  if (re.test(email)) {
    return email;
  } else {
    throw `Invalid email`;
  }
};

// the password should contain a capital letter, a small letter, a number, and a special character and has to 6 or more characters
export const passwordValidator = (password) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (re.test(password)) {
    return password;
  } else {
    throw `Invalid password`;
  }
};

// basic string validation
export const stringValidator = (str, type) => {
  if (!str || str.trim().length == 0) throw `${type} cannot be empty`;
  if (typeof str !== "string") throw `${type} should be a string`;
  return str;
};

// category validation
export const categoryValidator = (cat) => {
  if (!cat || cat.trim().length == 0) throw `category cannot be empty`;
  if (typeof cat !== "string") throw `category should be a string`;
  if (
    ![
      "work",
      "home",
      "health",
      "finance",
      "shopping",
      "social",
      "education",
      "travel",
    ].includes(cat.toLowerCase())
  )
    throw `${cat} is not a valid category`;
  return cat;
};


