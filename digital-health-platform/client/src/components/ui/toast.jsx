import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex items-center gap-4 rounded-lg shadow-lg px-4 py-3 text-white bg-blue-600 animate-in fade-in slide-in-from-bottom-5",
);

export function Toast({ title, description }) {
  return (
    <div className={toastVariants()}>
      <div>
        <p className="font-semibold">{title}</p>
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
      </div>
    </div>
  );
}
