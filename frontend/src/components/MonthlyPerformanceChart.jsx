"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Questo componente prende in ingresso il simbolo su cui mostrare i dati
export function MonthlyPerformanceChart({ symbol }) {
  const [chartData, setChartData] = useState([]);
  const [trend, setTrend] = useState({ direction: "up", percent: 0 });
  const [error, setError] = useState(null);

  // ATTENZIONE: in produzione non tenere la chiave sul client!
  const ALPHA_VANTAGE_API_KEY = "REMOVED"; // Sostituisci con la tua vera API Key

  useEffect(() => {
    if (!symbol) return; // se non abbiamo un simbolo, niente chiamata

    // Se il simbolo è tipo "NASDAQ:MSFT", rimuoviamo il prefisso
    const alphaSymbol = symbol.split(":").pop();

    // Costruiamo la URL per TIME_SERIES_MONTHLY_ADJUSTED
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${alphaSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nella chiamata a Alpha Vantage");
        }
        return res.json();
      })
      .then((data) => {
        const monthlyData = data["Monthly Adjusted Time Series"];
        if (!monthlyData) {
          throw new Error("Dati mensili non trovati per questo simbolo");
        }

        // Convertiamo l'oggetto in un array di { date, close }.
        let parsed = Object.entries(monthlyData).map(([date, values]) => ({
          date,
          close: parseFloat(values["4. close"]),
        }));

        // Ordina in ordine cronologico ascendente
        parsed = parsed.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Prendiamo solo gli ultimi 12 mesi
        parsed = parsed.slice(-12);

        // Mappa i dati in un formato adatto al chart (es: { month: "Jun", close: 123.45 })
        const finalData = parsed.map((item) => {
          const d = new Date(item.date);
          const monthName = d.toLocaleString("default", { month: "short" }); // "Jan", "Feb", ...
          return { month: monthName, close: item.close };
        });

        setChartData(finalData);

        // Calcoliamo la percentuale di variazione tra il primo e l'ultimo dei 12 mesi
        const firstClose = parsed[0].close;
        const lastClose = parsed[parsed.length - 1].close;
        const change = ((lastClose - firstClose) / firstClose) * 100;

        setTrend({
          direction: change >= 0 ? "up" : "down",
          percent: change.toFixed(2),
        });
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setChartData([]);
      });
  }, [symbol, ALPHA_VANTAGE_API_KEY]);

  // Configurazione per il ChartContainer
  const chartConfig = {
    close: {
      label: "Monthly Close",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
        <CardDescription>Last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-600">{error}</p>}

        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} margin={{ top: 20 }} width={500} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="close" fill="var(--color-close)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trend.direction === "up" ? (
          <div className="flex gap-2 font-medium leading-none text-green-600">
            Trending up by {trend.percent}% <TrendingUp className="h-4 w-4" />
          </div>
        ) : (
          <div className="flex gap-2 font-medium leading-none text-red-600">
            Trending down by {trend.percent}% <TrendingDown className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing last 12 months of close data
        </div>
      </CardFooter>
    </Card>
  );
}
