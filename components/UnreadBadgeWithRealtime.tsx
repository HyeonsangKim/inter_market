// components/UnreadBadgeWithRealtime.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import UnreadBadge from "./UnreadCount";

interface UnreadBadgeWithRealtimeProps {
  initialCount: number;
  userId: string;
}

export default function UnreadBadgeWithRealtime({
  initialCount,
  userId,
}: UnreadBadgeWithRealtimeProps) {
  const [unreadCount, setUnreadCount] = useState(initialCount);

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string
    );

    const channel = client.channel("message-status");

    // 새 메시지가 오면 카운트 증가
    channel
      .on("broadcast", { event: "new-message" }, (payload) => {
        if (payload.receiverId === userId) {
          setUnreadCount((prev) => prev + 1);
        }
      })
      // 메시지를 읽으면 카운트 감소
      .on("broadcast", { event: "read-messages" }, (payload) => {
        if (payload.userId === userId) {
          setUnreadCount(payload.newCount); // 또는 서버에서 새로운 카운트를 받아오기
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return <UnreadBadge count={unreadCount} />;
}
