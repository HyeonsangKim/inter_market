import Footer from "@/components/footer";
import LanguageSelector from "@/components/language-selector";

export default async function CreateAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <LanguageSelector />
      {children}
      <Footer />
    </div>
  );
}
