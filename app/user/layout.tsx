import AddressInfo from "@/components/Address";
import { checkAddress } from "@/lib/location";
import Footer from "@/components/CustomFooter";
import { getCurrentUser } from "@/app/utils/supabase/get-user";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getCurrentUser();
  const addressExit = await checkAddress();

  return (
    <div>
      <div className="container">
        <AddressInfo
          address={addressExit}
          userId={userData ? userData.id : null}
        />
        {children}
      </div>
      <Footer />
    </div>
  );
}
