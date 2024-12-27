// frontend/app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export default function Dashboard() {
  const router = useRouter();
  const [message, setMessage] = useState("");

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

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Investing Ideas Dashboard</h1>

      {/* Messaggio di Benvenuto */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}

      {/* Pulsante di Logout */}
      <LogoutButton />
    </main>
  );
}
