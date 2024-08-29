import getCurrentUser from "@/lib/getCurrentUser";
import Link from "next/link";

export default async function Home() {
  const userData = await getCurrentUser();
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <h1 className="text-9xl">🌏</h1>
        <h2 className="text-4xl">Exchange Market</h2>
        <h2 className="text-4xl">Welcome!</h2>
        <h2 className="text-2xl mt-5 p-3">
          Exchange your product or sell, and make a friend. Get a information
          about Korea in here!
        </h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg">
          Start
        </Link>
        <div className="flex gap-2">
          <span>Do you have account already?</span>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
