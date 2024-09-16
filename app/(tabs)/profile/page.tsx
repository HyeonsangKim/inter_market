import { signOut } from "next-auth/react";
import Image from "next/image";
import { Logout } from "@/components/client-button";
import Button from "@/components/button";
import { useUser } from "@/components/userContext";
import { Edit, Mail } from "lucide-react";
import { ProfileForm } from "@/components/profile-form";
import getCurrentUser from "@/lib/getCurrentUser";

export default async function Page() {
  // const userData = useUser();
  // console.log(userData.image);
  const session = await getCurrentUser();
  console.log(session);

  return <ProfileForm userData={session} />;
}
