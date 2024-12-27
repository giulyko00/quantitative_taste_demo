// frontend/components/app-sidebar.jsx
"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  ChartCandlestick,
  Map,
  PieChart,
  Leaf,
  Settings2,
  SquareTerminal,
  Bitcoin,  
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { slugify } from "@/lib/slugify"; // Importa la funzione slugify

const icons = {
  Bot,
  Leaf,
  SquareTerminal,
  Bitcoin,
  BookOpen, // Default icon
};

const getIconComponent = (iconName) => icons[iconName] || icons["BookOpen"];

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Quantaste DEMO",
      logo: ChartCandlestick,
      plan: "Premium Plan",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "" });

  const [categories, setCategories] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [navMain, setNavMain] = useState([]);

  // Caricamento delle categorie
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
  
    // Recupera i dati utente
    fetch("http://127.0.0.1:8000/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati utente");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error(err));

      fetch("http://127.0.0.1:8000/categories-with-ideas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Errore nel recupero delle categorie con idee");
          }
          return response.json();
        })
        .then((data) => {
          const formattedNavMain = data.map((category) => ({
            title: category.title,
            url: "#",
            icon: getIconComponent(category.icon), // Ottieni il componente dell'icona
            items: category.items.map((item, index) => ({
              title: `${index + 1} - ${item.title}`,
              url: `/idea/${slugify(category.title)}/${slugify(item.title)}`, // Link alla pagina dettaglio idea
            })),
          }));
      
          setNavMain(formattedNavMain);
        })
        .catch((err) => console.error(err));
      
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
