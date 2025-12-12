import type { Request, Response } from "express";
import { usersService } from "../services/users.service.js";
import { SearchUserSchema } from "../utils/validation.js";

export class UsersController {
  async search(req: Request, res: Response) {
    try {
      const validatedInput = SearchUserSchema.parse(req.query);
      const currentUserId = (req as any).user.userId;

      const users = await usersService.searchByUsername(
        validatedInput.username,
        currentUserId
      );

      res.status(200).json({
        success: true,
        data: users,
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

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const user = await usersService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const usersController = new UsersController();
