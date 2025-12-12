import express from "express";
import { usersController } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/search", authMiddleware, (req, res) =>
  usersController.search(req, res)
);
router.get("/profile", authMiddleware, (req, res) =>
  usersController.getProfile(req, res)
);

export default router;
