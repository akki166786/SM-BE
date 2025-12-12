export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export interface AuthRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface MessagePayload {
  conversation_id: string;
  sender_id: string;
  content: string;
  type?: MessageType;
}

export type MessageType = "text" | "image" | "video" | "gif" | "document" | "location";
