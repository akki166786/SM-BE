import { prisma } from "../db/prisma.js";
import { errors } from "../utils/errors.js";
import type { SendMessageInput } from "../utils/validation.js";

export class MessagesService {
  async sendMessage(senderId: string, input: SendMessageInput) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversation_id },
    });

    if (!conversation) {
      throw errors.notFound("Conversation");
    }

    const isMember =
      conversation.user1_id === senderId ||
      conversation.user2_id === senderId;

    if (!isMember) {
      throw errors.forbidden();
    }

    const message = await prisma.message.create({
      data: {
        conversation_id: input.conversation_id,
        sender_id: senderId,
        content: input.content,
        type: input.type || "text",
      },
      include: {
        sender: {
          select: { id: true, username: true },
        },
      },
    });

    return message;
  }

  async fetchMessages(
    conversationId: string,
    userId: string,
    limit = 50,
    offset = 0
  ) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
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

    const messages = await prisma.message.findMany({
      where: { conversation_id: conversationId },
      include: {
        sender: {
          select: { id: true, username: true },
        },
      },
      orderBy: { created_at: "desc" },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.message.count({
      where: { conversation_id: conversationId },
    });

    return {
      messages: messages.reverse(),
      total: totalCount,
    };
  }

  async markAsRead(conversationId: string, userId: string) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
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

    await prisma.message.updateMany({
      where: {
        conversation_id: conversationId,
        NOT: { sender_id: userId },
        is_read: false,
      },
      data: { is_read: true },
    });

    return { success: true };
  }
}

export const messagesService = new MessagesService();
