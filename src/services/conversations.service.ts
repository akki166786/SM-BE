import { prisma } from "../db/prisma.js";
import { errors } from "../utils/errors.js";

export class ConversationsService {
  async createConversation(userId1: string, userId2: string) {
    if (userId1 === userId2) {
      throw errors.badRequest("Cannot create conversation with yourself");
    }

    const user2 = await prisma.user.findUnique({
      where: { id: userId2 },
    });

    if (!user2) {
      throw errors.notFound("User");
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            user1_id: userId1,
            user2_id: userId2,
          },
          {
            user1_id: userId2,
            user2_id: userId1,
          },
        ],
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    const conversation = await prisma.conversation.create({
      data: {
        user1_id: userId1,
        user2_id: userId2,
      },
      include: {
        user1: {
          select: { id: true, username: true, email: true },
        },
        user2: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    return conversation;
  }

  async listConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1_id: userId }, { user2_id: userId }],
      },
      include: {
        user1: {
          select: { id: true, username: true, email: true },
        },
        user2: {
          select: { id: true, username: true, email: true },
        },
        messages: {
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
      orderBy: { created_at: "desc" },
    });

    return conversations;
  }

  async getConversation(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: {
          select: { id: true, username: true, email: true },
        },
        user2: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    if (!conversation) {
      throw errors.notFound("Conversation");
    }

    const isMember =
      conversation.user1_id === userId ||
      conversation.user2_id === userId;

    if (!isMember) {
      throw errors.forbidden();
    }

    return conversation;
  }
}

export const conversationsService = new ConversationsService();
