import bcrypt from "bcrypt";
import { emailValidator, passwordValidator } from "../helpers.js";
import User from "../models/user.js";
let saltRounds = 10;

export const createUser = async (email, password) => {
  // validation before adding to db
  if (!email) throw [400, "Error: email empty"];
  if (!password) throw [400, "Error: Password empty"];
  if (typeof email !== "string") throw [400, "Error: email should be string"];
  if (typeof password !== "string")
    throw [400, "Error: Password should be string"];
  if (email.trim().length == 0)
    throw [400, "Error: email should not be just empty spaces"];
  if (password.trim().length == 0)
    throw [400, "Error: Password should not be just empty spaces"];

  email = email.toLowerCase();
  email = emailValidator(email);
  password = passwordValidator(password);
  const cryptedPassword = await bcrypt.hash(password, saltRounds);

  //   check if already in db
  if (await User.findOne({ email })) throw [400, "Error: user already in db"];

  //   add to db
  const user = new User({ email, password: cryptedPassword });
  const userInfo = await user.save();
  // console.log(userInfo);
  return userInfo;
};

export const loginUser = async (email, password) => {
  // validation before adding to db
  if (!email) throw [400, "Error: email empty"];
  if (!password) throw [400, "Error: Password empty"];
  if (typeof email !== "string") throw [400, "Error: email should be string"];
  if (typeof password !== "string")
    throw [400, "Error: Password should be string"];
  if (email.trim().length == 0)
    throw [400, "Error: email should not be just empty spaces"];
  if (password.trim().length == 0)
    throw [400, "Error: Password should not be just empty spaces"];

  email = email.toLowerCase();
  email = emailValidator(email);
  password = passwordValidator(password);

  // find the user
  const userData = await User.findOne({ email });
  if (userData === null) throw [404, "Incorrect email or password"];
  else if (await bcrypt.compare(password, userData.password)) return userData;
  throw [404, "Incorrect email or password"];
};

export const getUserByEmail = async (email) => {
  if (!email) throw [400, "email empty"];
  if (typeof email !== "string") throw [400, "email should be string"];
  if (email.trim().length == 0)
    throw [400, "email should not be just empty spaces"];
  email = email.toLowerCase();
  email = emailValidator(email);

  const userData = await User.findOne({email});
  if (!userData) {
    throw [404, "User not found"];
  } else {
    return userData;
  }
};
