import AddressInfo from "@/components/address";
import { checkAddress } from "@/lib/location";
import { getCurrentUser } from "../utils/supabase/get-user";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getCurrentUser();
  const addressExit = await checkAddress();

  return (
    <div>
      <AddressInfo
        address={addressExit}
        userId={userData ? userData.id : null}
      />
      {children}
    </div>
  );
}
