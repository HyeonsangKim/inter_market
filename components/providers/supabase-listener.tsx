"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";

export default function SupabaseListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== undefined) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return children;
}
