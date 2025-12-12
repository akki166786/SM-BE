import { prisma } from "../db/prisma.js";
import { hashPassword, verifyPassword, generateToken } from "../utils/auth.js";
import { errors } from "../utils/errors.js";
import type { RegisterInput, LoginInput } from "../utils/validation.js";

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    });

    if (existingUser) {
      throw errors.conflict("Email or username already exists");
    }

    const password_hash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password_hash,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw errors.notFound("User");
    }

    const isPasswordValid = await verifyPassword(
      input.password,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw errors.unauthorized();
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }
}

export const authService = new AuthService();
