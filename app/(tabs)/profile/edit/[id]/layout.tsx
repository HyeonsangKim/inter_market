import TabBar from "@/components/TabBar";
import { UserProvider } from "@/components/userContext";
import getCurrentUser from "@/lib/getCurrentUser";
import React from "react";

export default async function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getCurrentUser();
  return (
    <UserProvider userData={userData}>
      {children}
    </UserProvider>
  );
}
