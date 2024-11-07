"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  paramName: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  paramName,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => `${baseUrl}?${paramName}=${page}`;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
          currentPage === 1 ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {currentPage > 2 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="px-3 py-1 rounded-md hover:bg-gray-100"
          >
            1
          </Link>
          {currentPage > 3 && <span className="px-2">...</span>}
        </>
      )}

      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
        const page = Math.min(Math.max(currentPage - 1 + i, 1), totalPages);
        return (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={`px-3 py-1 rounded-md transition-colors ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages - 1 && (
        <>
          {currentPage < totalPages - 2 && <span className="px-2">...</span>}
          <Link
            href={createPageUrl(totalPages)}
            className="px-3 py-1 rounded-md hover:bg-gray-100"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
          currentPage === totalPages ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
