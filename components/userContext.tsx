"use client";
import React, { createContext, useContext, ReactNode } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  created_at: Date;
}

const UserContext = createContext<User | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
  userData: User | null;
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  userData,
}) => {
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};
