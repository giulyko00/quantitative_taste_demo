"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TradingViewWidget from "@/components/TradingViewWidget";
import { MonthlyPerformanceChart } from "@/components/MonthlyPerformanceChart";

import { useCategories } from "@/context/CategoriesContext";
import { useTheme } from "@/components/theme-provider";

export default function Idea() {
  const { theme } = useTheme();
  const { message, setMessage } = useCategories();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const ideaId = searchParams.get("idea");

  // Stati per la fetch di "ideaDetails"
  const [ideaDetails, setIdeaDetails] = useState(null);

  // Stati per la fetch di dati finanziari
  const [financialData, setFinancialData] = useState(null);
  const [error, setError] = useState(null);

  // La tua API key di Alpha Vantage (occhio a non tenerla in chiaro in produzione!)
  const ALPHA_VANTAGE_API_KEY = "REMOVED";

  const router = useRouter();

  // 1. Carica i dettagli dell'idea + verifica token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    // Verifica validità del token
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

    // Carica i dettagli dell'idea
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
  }, [categoryId, ideaId, router, setMessage]);

  // 2. Quando ideaDetails è disponibile, chiama Alpha Vantage per i dati finanziari
  useEffect(() => {
    if (!ideaDetails?.symbol) return;

    const alphaSymbol = ideaDetails.symbol.split(":").pop();

    const fetchStockData = async () => {
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Errore nella chiamata a Alpha Vantage");
        }
        const data = await res.json();
        const globalQuote = data["Global Quote"];
        if (!globalQuote) {
          throw new Error("Dati non trovati per questo simbolo");
        }

        const price = globalQuote["05. price"];
        const changePercent = globalQuote["10. change percent"];
        const volume = globalQuote["06. volume"];

        setFinancialData({ price, changePercent, volume });
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setFinancialData(null);
      }
    };

    fetchStockData();
  }, [ideaDetails, ALPHA_VANTAGE_API_KEY]);

  return (
    <main className="space-y-8">
      <h1
        className="text-3xl font-bold border-b pb-2 
                   text-gray-800 dark:text-gray-200 
                   border-gray-300 dark:border-gray-700"
      >
        Investing Ideas
      </h1>

      {ideaDetails ? (
        <div
          className="relative border p-6 rounded-md shadow-md space-y-6 
                     bg-white dark:bg-gray-900 
                     border-gray-300 dark:border-gray-700"
        >
          {/* BOX IN ALTO A DESTRA PER I DATI FINANZIARI */}
          {financialData && (
            <div
              className="absolute top-8 right-8 bg-gray-100 dark:bg-gray-800 
               p-4 rounded-lg shadow-md w-72 border 
               border-gray-300 dark:border-gray-700 space-y-3 z-50"
            >
              <div className="flex justify-between items-center border-b pb-2 border-gray-300 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  Dati Finanziari
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {ideaDetails.symbol}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  <strong className="font-bold text-gray-900 dark:text-gray-100">
                    Prezzo:
                  </strong>{" "}
                  {financialData.price} USD
                </p>
                <p
                  className={`text-sm font-medium ${
                    financialData.changePercent?.startsWith("-")
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  <strong className="font-bold text-gray-900 dark:text-gray-100">
                    Variazione:
                  </strong>{" "}
                  {financialData.changePercent}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  <strong className="font-bold text-gray-900 dark:text-gray-100">
                    Volume:
                  </strong>{" "}
                  {financialData.volume}
                </p>
              </div>
            </div>
          )}

          {/* In caso di errori, li mostriamo */}
          {error && (
            <div className="absolute top-4 right-4 bg-red-100 dark:bg-red-800 p-3 rounded shadow-sm">
              <p className="text-sm text-red-600 dark:text-red-200">
                <strong>Errore:</strong> {error}
              </p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {ideaDetails.name}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-bold text-gray-900 dark:text-gray-100">
              Descrizione:
            </strong>{" "}
            {ideaDetails.description}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-bold text-gray-900 dark:text-gray-100">
              Performance:
            </strong>{" "}
            {ideaDetails.performance}
          </p>
          <div className="mt-6">
            <TradingViewWidget symbol={ideaDetails.symbol} theme={theme} />
          </div>
          <a
            href={ideaDetails.chartLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-blue-600 hover:text-blue-400 underline 
                       dark:text-blue-500 dark:hover:text-blue-300 mt-4"
          >
            Vedi grafico completo
          </a>
          {/* Aggiungi il tuo nuovo componente di performance mensile */}
<div className="mt-6">
  <MonthlyPerformanceChart symbol={ideaDetails.symbol} />
</div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Caricamento dei dati in corso...</p>
        </div>
      )}
    </main>
  );
}
