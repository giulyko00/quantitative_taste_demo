"use client";
import { useEffect, useRef } from 'react';

export default function TradingViewWidget({ symbol = "NASDAQ:GOOGL" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Creiamo uno script element
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      // Quando lo script è caricato, creiamo il widget
      if (window.TradingView) {
        new window.TradingView.widget({
          symbol: symbol,
          // Esempio: "NASDAQ:GOOGL"
          container_id: containerRef.current.id,
          autosize: true,
          theme: "light",
          style: "1",
          locale: "it",
        });
      }
    };

    containerRef.current.appendChild(script);
  }, [symbol]);

  // Ritorniamo un container dove TradingView monterà il widget
  return (
    <div 
      id="tradingview_widget" 
      ref={containerRef} 
      style={{ height: 400 }}
    />
  );
}
