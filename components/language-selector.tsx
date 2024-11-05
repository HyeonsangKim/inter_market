// components/language-selector.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 현재 locale 감지
  const currentLocale = pathname.split("/")[1] || "en";
  const currentLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLocale) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    // 현재 경로에서 locale 부분만 변경
    const segments = pathname.split("/");
    segments[1] = lang.code;
    const newPath = segments.join("/");

    // 쿠키에 locale 저장
    document.cookie = `locale=${lang.code};path=/;max-age=31536000`;

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center space-x-1 rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-sm hover:bg-gray-50"
      >
        <Globe size={18} className="text-gray-600" />
        <span>{currentLang.flag}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-32 sm:bottom-20 right-4 sm:right-6 z-40 w-40 rounded-lg bg-white/95 backdrop-blur-sm shadow-lg border mb-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`flex w-full items-center space-x-3 px-3 py-1.5 hover:bg-gray-50 ${
                currentLang.code === lang.code ? "bg-gray-50" : ""
              }`}
            >
              <span>{lang.flag}</span>
              <span className="text-sm text-gray-700">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
