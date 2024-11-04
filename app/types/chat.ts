import { ChatRoom, User } from "@prisma/client";
import { Message } from "postcss";

export type RoomWithUsers = ChatRoom & {
  users: Pick<User, "id" | "name" | "image">[];
  messages?: Message[];
};

export interface MessageWithUser {
  id: number;
  payload: string;
  created_at: Date;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  sender: {
    name: string | null;
    image: string | null;
  };
  receiver: {
    name: string | null;
    image: string | null;
  };
}
export type ChatRoomWithUsersAndMessages = ChatRoom & {
  users: User[];
  messages: (Message & {
    sender: Pick<User, "id" | "name" | "image">;
    receiver: Pick<User, "id" | "name" | "image">;
  })[];
};
