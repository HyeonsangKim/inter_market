import Footer from "@/components/CustomFooter";
import LanguageSelector from "@/components/LanguageSelector";
import React from "react";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <LanguageSelector />
      {children}
      <Footer />
    </div>
  );
}
