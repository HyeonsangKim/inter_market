import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Interagora",
  description: "Inter Agora",
};
export const dynamic = "force-dynamic";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-b-50 min-h-screen`}>
        <Header />
        <main className="">{children}</main>
      </body>
    </html>
  );
}
