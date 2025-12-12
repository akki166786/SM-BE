import type { Request, Response } from "express";
import { messagesService } from "../services/messages.service.js";
import { SendMessageSchema, FetchMessagesSchema } from "../utils/validation.js";

export class MessagesController {
  async send(req: Request, res: Response) {
    try {
      const validatedInput = SendMessageSchema.parse(req.body);
      const senderId = (req as any).user.userId;

      const message = await messagesService.sendMessage(senderId, validatedInput);

      res.status(201).json({
        success: true,
        data: message,
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

  async fetch(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const validatedInput = FetchMessagesSchema.parse({
        conversation_id: conversationId,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      });
      const userId = (req as any).user.userId;

      const result = await messagesService.fetchMessages(
        validatedInput.conversation_id,
        userId,
        validatedInput.limit,
        validatedInput.offset
      );

      res.status(200).json({
        success: true,
        data: result,
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

  async markAsRead(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = (req as any).user.userId;

      const result = await messagesService.markAsRead(conversationId, userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const messagesController = new MessagesController();
