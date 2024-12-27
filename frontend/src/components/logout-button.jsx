// components/logout-button.jsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout} className="mt-4">
      Logout
    </Button>
  );
}
