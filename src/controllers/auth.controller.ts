import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { RegisterSchema, LoginSchema } from "../utils/validation.js";
import { errors } from "../utils/errors.js";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validatedInput = RegisterSchema.parse(req.body);
      const result = await authService.register(validatedInput);

      res.status(201).json({
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

  async login(req: Request, res: Response) {
    try {
      const validatedInput = LoginSchema.parse(req.body);
      const result = await authService.login(validatedInput);

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

  async verifyToken(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user) {
        throw errors.unauthorized();
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      throw error;
    }
  }
}

export const authController = new AuthController();
