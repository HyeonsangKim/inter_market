import AddressInfo from "@/components/address";
import getCurrentUser from "@/lib/getCurrentUser";
import { checkAddress } from "@/lib/location";

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
        userId={userData ? userData!.id : ""}
      />
      {children}
    </div>
  );
}
