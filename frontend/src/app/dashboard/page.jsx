// frontend/app/dashboard/page.jsx
"use client"; // Assicurati di avere questa direttiva all'inizio

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TradingViewWidget from "@/components/TradingViewWidget"; 
import { LogoutButton } from "@/components/logout-button"; // Assicurati che questo componente esista
import { Sidebar } from "@/components/ui/sidebar";
import {
  Bot,
  Map,
  BookOpen,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]); // Inizializzazione di categories
  const [selectedCategory, setSelectedCategory] = useState(null); // Inizializzazione di selectedCategory
  const [ideas, setIdeas] = useState([]); // Inizializzazione di ideas

  // Verifica l'autenticazione dell'utente
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // Se non c'è token, reindirizza al login
      router.push("/login"); // Assicurati che il percorso sia corretto
      return;
    }

    // Chiamata al backend per verificare il token
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
        router.push("/login"); // Reindirizza in caso di errore
      });
  }, [router]);

  // Fetch delle categorie al primo caricamento
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return; 

    fetch("http://127.0.0.1:8000/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel recupero delle categorie");
        }
        return response.json();
      })
      .then((data) => {
        const categorizedData = data.map((category) => ({
          title: category,
          icon: categoryIcons[category] || BookOpen, // Usa una icona di default se non trovata
        }));
        setCategories(categorizedData);
      })
      .catch((err) => console.log(err));
  }, []);

  // Funzione per caricare le idee di una categoria
  const loadIdeas = (category) => {
    setSelectedCategory(category);
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login"); 
      return;
    }

    fetch(`http://127.0.0.1:8000/ideas/${encodeURIComponent(category)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel recupero delle idee");
        }
        return response.json();
      })
      .then((data) => setIdeas(data))
      .catch((err) => console.log(err));
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Investing Ideas Dashboard</h1>

      {/* Messaggio di Benvenuto */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}

      {/* Lista categorie */}
      <h2 className="text-xl font-semibold">Categorie</h2>
      <ul className="list-disc pl-5 mb-4">
        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <li key={index}>
              <button
                className="text-blue-600 underline"
                onClick={() => loadIdeas(cat)}
              >
                {cat}
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">Caricamento categorie...</li>
        )}
      </ul>

      {/* Se esiste una categoria selezionata, mostriamo le sue idee */}
      {selectedCategory && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            Top 10 idee per: {selectedCategory}
          </h2>
          <ul className="space-y-4">
            {ideas.length > 0 ? (
              ideas.map((idea, i) => (
                <li key={i} className="border p-4 rounded-md">
                  <p>
                    <strong>Nome:</strong> {idea.name}
                  </p>
                  <p>
                    <strong>Descrizione:</strong> {idea.description}
                  </p>
                  <p>
                    <strong>Performance:</strong> {idea.performance}
                  </p>

                  <TradingViewWidget symbol={"NASDAQ:GOOGL"} />

                  {/* Link a un grafico placeholder */}
                  <a
                    href={idea.chartLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Vedi grafico
                  </a>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Caricamento idee...</li>
            )}
          </ul>
        </div>
      )}

      {/* Pulsante di Logout */}
      <LogoutButton />
    </main>
  );
}
