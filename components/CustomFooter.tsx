import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-6 py-8 text-gray-700">
        {/* Main content */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm sm:text-base">
          {/* Logo & Description */}
          <div className="space-y-3 text-center sm:text-left">
            <Link
              href="/"
              className="flex items-center justify-center sm:justify-start space-x-2 text-xl font-semibold text-gray-800"
            >
              <span className="text-3xl">🌏</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InterAgora
              </span>
            </Link>
            <p className="text-gray-500">Exchange items, make friends</p>
          </div>

          {/* Services */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Explore</h3>
            <ul className="space-y-1 text-gray-500">
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Legal</h3>
            <ul className="space-y-1 text-gray-500">
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom content */}
        <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-3 sm:space-y-0">
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} MyPortfolio. All rights reserved.
          </p>
          <a
            href="https://github.com/HyeonsangKim/inter_market"
            className="text-gray-400 hover:text-gray-600 transition-colors flex items-center space-x-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
