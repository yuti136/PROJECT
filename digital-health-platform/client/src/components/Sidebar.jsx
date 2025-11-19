// client/src/components/Sidebar.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/appointments/patient", label: "Appointments" },
  { href: "/patients", label: "Patients" },
  { href: "/reports", label: "Reports" },
];

export default function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <aside className="w-64 hidden md:flex flex-col bg-white border-r">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">Digital Health</h1>
        <p className="text-sm text-gray-500 mt-1">Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => {
          // show certain links only for specific roles (example)
          if (l.href === "/patients" && role !== "provider") return null;
          return (
            <a
              key={l.href}
              href={l.href}
              className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
            >
              {l.label}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
