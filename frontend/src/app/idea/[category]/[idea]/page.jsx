// frontend/app/idea/[category]/[idea]/page.jsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import { LogoutButton } from "@/components/logout-button";

export default function IdeaDetail() {
  const router = useRouter();
  const params = useParams();
  const { category, idea } = params;

  const [ideaData, setIdeaData] = useState(null);
  const [error, setError] = useState(null);

  // Funzione per estrarre il simbolo dall'idea (es. "Google Inc. - GOOGL" -> "GOOGL")
  const getSymbol = (name) => {
    const parts = name.split(" - ");
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "GOOGL"; // Default se non trovato
  };

  useEffect(() => {
    const fetchIdea = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/ideas/${encodeURIComponent(category)}/${encodeURIComponent(idea)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati dell'idea");
        }

        const data = await response.json();
        setIdeaData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchIdea();
  }, [category, idea, router]);

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!ideaData) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Caricamento idea...</p>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{ideaData.name}</h1>
      <p className="mb-4"><strong>Descrizione:</strong> {ideaData.description}</p>
      <p className="mb-4"><strong>Performance:</strong> {ideaData.performance}</p>
      
      <TradingViewWidget symbol={`NASDAQ:${getSymbol(ideaData.name)}`} />
      
      <a
        href={ideaData.chartLink}
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 underline"
      >
        Vedi grafico
      </a>
      
      <div className="mt-6">
        <LogoutButton />
      </div>
    </main>
  );
}
