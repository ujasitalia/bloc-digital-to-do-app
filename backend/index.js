import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import toDoRoutes from "./routes/toDoRoutes.js";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import ToDo from "./models/ToDo.js";

// configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// middleware to verify if the user if authenticated
app.use("/", async (req, res, next) => {
  if (!((req.originalUrl === "/user/register" && req.method === "POST") || (req.originalUrl === "/user/login" && req.method === "POST"))) {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    let payload = jwt.verify(token, "secret123");
    const userData = await User.findById(payload.id);
    if (!userData) {
      res.status(401).json("Unauthorized");
      return;
    } else {
      req.user = userData;
      next();
      return;
    }
  }
  else{
    next();
  }
  
});
app.use("/user", userRoutes);
app.use('/todo', toDoRoutes);

// mongoose setup
const PORT = process.env.PORT || 5000;
mongoose
  .connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`${error}. did not connect`);
  });
