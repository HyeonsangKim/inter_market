import AddressInfo from "@/components/address";
import { checkAddress } from "@/lib/location";
import Footer from "@/components/footer";
import LanguageSelector from "@/components/language-selector";
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
      <AddressInfo
        address={addressExit}
        userId={userData ? userData.id : null}
      />
      <LanguageSelector />
      {children}
      <Footer />
    </div>
  );
}
