// client/src/components/Layout.jsx
import React from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="p-6 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
