import express from "express";
import { emailValidator, passwordValidator } from "../helpers.js";
import { createUser, loginUser } from "../data/userData.js";
import jwt from "jsonwebtoken";
const secret = "secret123";

const router = express.Router();

router.get("/", async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(404).json("user not found");
  }
});

// register
router.post("/register", async (req, res) => {
  let { email, password } = req.body;
  try {
    // validate user data
    // console.log(email, password);
    email = emailValidator(email);
    password = passwordValidator(password);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }

  try {
    // send data to data file to push to db
    const userInfo = await createUser(email, password);
    jwt.sign(
      { id: userInfo._id, email: userInfo.email },
      secret,
      (err, token) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: err });
        } else {
          res.json({ id: userInfo._id, email: userInfo.email, token });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

// login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    // validate user data
    email = emailValidator(email);
    password = passwordValidator(password);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }

  try {
    // send data to data file to push to db
    const userInfo = await loginUser(email, password);
    jwt.sign(
      { id: userInfo._id, email: userInfo.email },
      secret,
      (err, token) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: err });
        } else {
          res
            .status(200)
            .json({ id: userInfo._id, email: userInfo.email, token });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
});

export default router;
