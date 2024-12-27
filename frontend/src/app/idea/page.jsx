"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TradingViewWidget from "@/components/TradingViewWidget"; 
import { LogoutButton } from "@/components/logout-button"; 
import { useCategories } from "@/context/CategoriesContext"; // Importa il contesto

export default function Dashboard() {
  const {
    message,
    setMessage,
    selectedCategory,
    ideas,
  } = useCategories();

  const [selectedIdea, setSelectedIdea] = useState(null);
  const [ideaDetails, setIdeaDetails] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
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
        router.push("/login");
      });
  }, [router, setMessage]);

  const fetchIdeaDetails = async (category, ideaName) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/ideas/${category}/${ideaName}`);
      if (!response.ok) throw new Error("Idea non trovata");
      const data = await response.json();
      setIdeaDetails(data);
    } catch (error) {
      console.error(error);
      setIdeaDetails(null);
    }
  };

  const handleIdeaClick = (idea) => {
    setSelectedIdea(idea.name);
    fetchIdeaDetails(selectedCategory, idea.name.toLowerCase().replace(/[\s.,]/g, "-"));
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Investing Ideas Dashboard</h1>

      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}

      {selectedCategory ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Top idee per: {selectedCategory}
          </h2>
          <ul className="space-y-4">
            {ideas.length > 0 ? (
              ideas.map((idea, i) => (
                <li
                  key={i}
                  className={`border p-4 rounded-md cursor-pointer ${
                    selectedIdea === idea.name ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handleIdeaClick(idea)}
                >
                  <p>
                    <strong>Nome:</strong> {idea.name}
                  </p>
                  <p>
                    <strong>Descrizione:</strong> {idea.description}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Caricamento idee...</li>
            )}
          </ul>

          {ideaDetails && (
            <div className="mt-8 border p-4 rounded-md bg-white shadow">
              <h3 className="text-xl font-bold mb-4">{ideaDetails.name}</h3>
              <p>
                <strong>Descrizione:</strong> {ideaDetails.description}
              </p>
              <p>
                <strong>Performance:</strong> {ideaDetails.performance}
              </p>
              <TradingViewWidget symbol={"NASDAQ:GOOGL"} />
              <a
                href={ideaDetails.chartLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline"
              >
                Vedi grafico
              </a>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Seleziona una categoria dalla sidebar per vedere le idee.</p>
      )}

      <LogoutButton />
    </main>
  );
}
