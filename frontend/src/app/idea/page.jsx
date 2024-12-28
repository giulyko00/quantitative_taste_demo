"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TradingViewWidget from "@/components/TradingViewWidget"; 
import { LogoutButton } from "@/components/logout-button"; 
import { useCategories } from "@/context/CategoriesContext"; 
import { useTheme } from "@/components/theme-provider";


export default function Idea() {
  const { theme, toggleTheme } = useTheme(); // Ottieni il tema corrente dal contesto
  const { message, setMessage } = useCategories();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const ideaId = searchParams.get("idea");

  const [ideaDetails, setIdeaDetails] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    fetch("http://127.0.0.1:8000/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Token non valido");
        }
        return res.json();
      })
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.error(err);
        router.push("/");
      });



      if (categoryId && ideaId) {
        fetch(`http://127.0.0.1:8000/ideas/${categoryId}/${ideaId}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error("Errore nel caricamento dell'idea");
            }
            return res.json();
          })
          .then((data) => setIdeaDetails(data))
          .catch((err) => console.error(err));
      }
    }, [categoryId, ideaId]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Investing Ideas Idea</h1>

      {ideaDetails ? (
        <div className="mt-8 border p-4 rounded-md ">
          <h3 className="text-xl font-bold mb-4">{ideaDetails.name}</h3>
          <p>
            <strong>Descrizione:</strong> {ideaDetails.description}
          </p>
          <p>
            <strong>Performance:</strong> {ideaDetails.performance}
          </p>
          <TradingViewWidget symbol={ideaDetails.symbol} theme={theme} />
          <a
            href={ideaDetails.chartLink}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            Vedi grafico
          </a>
        </div>
      ) : (
        <p className="text-gray-500">Seleziona un'idea dalla sidebar per vedere i dettagli.</p>
      )}
    </main>
  );
}
