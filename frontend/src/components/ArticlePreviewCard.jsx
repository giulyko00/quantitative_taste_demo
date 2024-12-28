"use client";

import { BookOpen } from "lucide-react";

export function ArticlePreviewCard({ url, title, snippet, image }) {
  return (
    <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex items-start gap-4">
      {/* Immagine di anteprima (opzionale) */}
      {image && (
        <img
          src={image}
          alt="Article Cover"
          className="w-16 h-16 object-cover rounded-md"
        />
      )}

      <div className="flex-1">
        {/* Titolo */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h3>
        {/* Breve estratto */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {snippet}
        </p>
        {/* Link all'articolo */}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mt-2 text-sm"
        >
          <BookOpen className="w-4 h-4 mr-1" />
          Leggi l'articolo completo
        </a>
      </div>
    </div>
  );
}
