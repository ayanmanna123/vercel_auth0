import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongo from "./utils/db.js";
import fs from "fs";

import asyncHandler from "express-async-handler";
import User from "./models/User.model.js";
import router from "./routes/auth.route.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://health-slot-fullstack-9zf9.vercel.app",
    "https://health-slot-fullstack.vercel.app",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(auth(config));

const enusureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });

    if (!existingUser) {
      // create a new user document
      const newUser = new User({
        auth0Id: user.sub,
        email: user.email,
        name: user.name,

        profilePicture: user.picture,
      });

      await newUser.save();

      console.log("User added to db", user);
    } else {
      console.log("User already exists in db", existingUser);
    }
  } catch (error) {
    console.log("Error checking or adding user to db", error.message);
  }
});
app.get("/chake", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // check if Auth0 user exists in the db
    await enusureUserInDB(req.oidc.user);

    // redirect to the frontend
    return res.redirect(process.env.CLIENT_URL);
  } else {
    return res.redirect(process.env.CLIENT_URL);
  }
});

app.use("/api/v1/user", router);

const server = async () => {
  try {
    await connectToMongo();

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

server();
