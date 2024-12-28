"use client";
import { useEffect, useRef } from "react";

export default function TradingViewWidget({ symbol = "NASDAQ:GOOGL", theme }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Pulisce il contenuto del container per evitare duplicazioni
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          symbol: symbol,
          container_id: containerRef.current.id,
          autosize: true,
          interval: "D",
          theme: theme, // Usa il tema passato come prop
          style: "1",
          locale: "it",
        });
      }
    };

    containerRef.current.appendChild(script);

    // Cleanup per evitare problemi di duplicazione
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme]); // Dipendenza su symbol e theme

  return (
    <div 
      id="tradingview_widget" 
      ref={containerRef} 
      style={{ height: 400 }}
    />
  );
}
