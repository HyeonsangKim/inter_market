import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/footer";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-between min-h-screen p-10 bg-gradient-to-b from-white to-gray-50">
        <div className="my-auto flex flex-col items-center gap-4 text-center max-w-3xl">
          <div className="animate-bounce">
            <h1 className="text-9xl">🌏</h1>
          </div>
          <div className="p-2">
            {/* 패딩 추가 */}
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent py-2">
              Inter Agora
            </h2>
          </div>
          <h2 className="text-4xl font-semibold text-gray-800">Welcome!</h2>
          <h2 className="text-xl text-gray-600 mt-5 p-3 leading-relaxed">
            Exchange your product or sell, and make a friend. Get a information
            about your neighbor in here!
          </h2>
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-md mb-8">
          <Link href="/create-account" className="w-full group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <button className="relative w-full px-6 py-3 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center group-hover:bg-indigo-50">
              <span className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
                Start Journey
              </span>
              <ArrowRight className="ml-2 w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <div className="flex gap-2 items-center bg-white px-6 py-3 rounded-lg shadow-md">
            <span className="text-gray-600">Do you have account already?</span>
            <Link
              href="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors relative group"
            >
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-800 mb-1">🤝 Exchange</h3>
              <p className="text-sm text-gray-600">
                Trade items with neighbors
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-800 mb-1">💬 Connect</h3>
              <p className="text-sm text-gray-600">Chat with local community</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
