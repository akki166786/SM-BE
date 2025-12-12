import express from "express";
import { conversationsController } from "../controllers/conversations.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, (req, res) =>
  conversationsController.create(req, res)
);
router.get("/", authMiddleware, (req, res) =>
  conversationsController.list(req, res)
);
router.get("/:conversationId", authMiddleware, (req, res) =>
  conversationsController.get(req, res)
);

export default router;
