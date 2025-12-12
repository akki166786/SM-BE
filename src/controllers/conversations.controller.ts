import type { Request, Response } from "express";
import { conversationsService } from "../services/conversations.service.js";
import { CreateConversationSchema } from "../utils/validation.js";

export class ConversationsController {
  async create(req: Request, res: Response) {
    try {
      const validatedInput = CreateConversationSchema.parse(req.body);
      const initiatorId = (req as any).user.userId;

      const conversation = await conversationsService.createConversation(
        initiatorId,
        validatedInput.participantId
      );

      res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "ZodError") {
          return res.status(400).json({
            success: false,
            error: error.message,
          });
        }
      }
      throw error;
    }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const conversations = await conversationsService.listConversations(userId);

      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      throw error;
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).user.userId;

      const conversation = await conversationsService.getConversation(
        conversationId,
        userId
      );

      res.status(200).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const conversationsController = new ConversationsController();
