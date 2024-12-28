"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TradingViewWidget from "@/components/TradingViewWidget"; 
import { LogoutButton } from "@/components/logout-button"; 
import { useCategories } from "@/context/CategoriesContext"; 
import { useTheme } from "@/components/theme-provider";

export default function Idea() {
  const { theme } = useTheme(); // Ottieni il tema corrente dal contesto
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
    <main className=" space-y-8">
      <h1 className="text-2xl font-bold ">Investing Ideas</h1>

      {ideaDetails ? (
        <div className="border p-6 rounded-md shadow-md  space-y-6">
          <h2 className="text-xl font-semibold ">{ideaDetails.name}</h2>
          <p className="">
            <strong className="font-semibold ">Descrizione:</strong> {ideaDetails.description}
          </p>
          <p className="">
            <strong className="font-semibold ">Performance:</strong> {ideaDetails.performance}
          </p>
          <div className="mt-6">
            <TradingViewWidget symbol={ideaDetails.symbol} theme={theme} />
          </div>
          <a
            href={ideaDetails.chartLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-blue-600 hover:text-blue-800 underline mt-4"
          >
            Vedi grafico completo
          </a>
        </div>
      ) : (
        <div className="text-center ">
          <p>Seleziona un'idea dalla sidebar per vedere i dettagli.</p>
        </div>
      )}
    </main>
  );
}
