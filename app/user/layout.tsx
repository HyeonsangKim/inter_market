import AddressInfo from "@/components/address";
import getCurrentUser from "@/lib/getCurrentUser";
import { checkAddress } from "@/lib/location";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const addressExit = await checkAddress();
  const userData = await getCurrentUser();

  return (
    <div>
      <AddressInfo address={addressExit} userId={userData!.id} />
      {children}
    </div>
  );
}
