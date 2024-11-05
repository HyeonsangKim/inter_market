import { getMessageRooms } from "./actions";
import { ChatRoom, Message, User } from "@prisma/client";
import { ChatItem } from "@/components/chat-item";
import { getCurrentUser } from "../utils/supabase/get-user";

export type ChatRoomWithUsersAndMessages = ChatRoom & {
  users: User[];
  messages: (Message & {
    sender: Pick<User, "id" | "name" | "image">;
    receiver: Pick<User, "id" | "name" | "image">;
  })[];
};
export default async function ChatList() {
  const session = await getCurrentUser();
  const chatList: ChatRoomWithUsersAndMessages[] = await getMessageRooms(
    session!.id
  );

  return (
    <div className="container mx-auto bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Chat</h2>
      </div>
      <div className="overflow-y-auto">
        {chatList.map((chat) => {
          const otherUser = chat.users.find((user) => user.id !== session!.id)!;
          const lastMessage = chat.messages[0];
          const unreadCount = chat.messages.filter(
            (msg) => msg.receiverId === session!.id && !msg.isRead
          ).length;

          return (
            <ChatItem
              key={chat.id}
              chatId={chat.id}
              currentUserId={session!.id}
              otherUser={otherUser}
              lastMessage={lastMessage}
              unreadCount={unreadCount}
            />
          );
        })}
      </div>
    </div>
  );
}
