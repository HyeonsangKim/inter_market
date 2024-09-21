import AddressInfo from "@/components/address";
import getCurrentUser from "@/lib/getCurrentUser";
import { checkAddress } from "@/lib/location";

export default async function UserLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      {modal}
      {children}
    </div>
  );
}
