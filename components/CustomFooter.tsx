import Link from "next/link";
import { Github } from "lucide-react";
import { headers } from "next/headers";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-2 flex sm:block flex-col items-center text-center sm:text-left">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold"
            >
              <span className="text-2xl">🌏</span>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                InterAgora
              </span>
            </Link>
            <p className="text-gray-500 text-sm">
              Exchange items, make friends
            </p>
          </div>

          <div className="flex sm:block flex-col items-center text-center sm:text-left">
            <h3 className="font-semibold mb-2">Services</h3>
            <ul className="space-y-1.5 text-sm text-gray-500">
              <li>
                <Link href="/marketplace">Marketplace</Link>
              </li>
              <li>
                <Link href="/community">Community</Link>
              </li>
            </ul>
          </div>

          <div className="flex sm:block flex-col items-center text-center sm:text-left">
            <h3 className="font-semibold mb-2">Legal</h3>
            <ul className="space-y-1.5 text-sm text-gray-500">
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Use</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 sm:pt-6 border-t flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} InterAgora
          </p>
          <a
            href="https://github.com/HyeonsangKim/inter_market"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
