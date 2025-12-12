import express from "express";
import { messagesController } from "../controllers/messages.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, (req, res) =>
  messagesController.send(req, res)
);
router.get("/:conversationId", authMiddleware, (req, res) =>
  messagesController.fetch(req, res)
);
router.put("/:conversationId/read", authMiddleware, (req, res) =>
  messagesController.markAsRead(req, res)
);

export default router;
