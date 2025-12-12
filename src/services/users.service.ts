import { prisma } from "../db/prisma.js";
import { errors } from "../utils/errors.js";

export class UsersService {
  async searchByUsername(username: string, excludeUserId?: string) {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
        ...(excludeUserId && { NOT: { id: excludeUserId } }),
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
      take: 20,
    });

    return users;
  }

  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw errors.notFound("User");
    }

    return user;
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      throw errors.notFound("User");
    }

    return user;
  }
}

export const usersService = new UsersService();
