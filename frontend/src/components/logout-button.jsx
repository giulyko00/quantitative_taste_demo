// components/logout-button.jsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/");
  };

  return (
    <Button onClick={handleLogout} className="">
      Logout
    </Button>
  );
}
