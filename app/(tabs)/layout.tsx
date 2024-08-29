"use client";
import TabBar from "@/components/TabBar";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div>{children}</div>
    </SessionProvider>
  );
}
