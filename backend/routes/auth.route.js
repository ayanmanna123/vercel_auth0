import express from "express";
import {
  getUserDetails,
  updateProfile,
} from "../controllers/auth.controller.js";

import pkg from "express-openid-connect";
const { requiresAuth } = pkg;
const router = express.Router();

router.route("/updateProfile").put(
  requiresAuth(),
  (req, res, next) => {
    req.id = req.oidc.user.sub;
    next();
  },
  updateProfile
);

router.route("/getUserDetails").get(
  requiresAuth(),
  (req, res, next) => {
    req.id = req.oidc.user.sub;
    next();
  },
  getUserDetails
);
export default router;
