import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SearchUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export const CreateConversationSchema = z.object({
  participantId: z.string().min(1, "Participant ID is required"),
});

export const SendMessageSchema = z.object({
  conversation_id: z.string().min(1, "Conversation ID is required"),
  content: z.string().min(1, "Message content is required"),
  type: z.enum(["text", "image", "video", "gif", "document", "location"]).default("text").optional(),
});

export const FetchMessagesSchema = z.object({
  conversation_id: z.string().min(1, "Conversation ID is required"),
  limit: z.number().default(50).optional(),
  offset: z.number().default(0).optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type SearchUserInput = z.infer<typeof SearchUserSchema>;
export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type FetchMessagesInput = z.infer<typeof FetchMessagesSchema>;
