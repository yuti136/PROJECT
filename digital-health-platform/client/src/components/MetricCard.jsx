// client/src/components/MetricCard.jsx
import React from "react";

export default function MetricCard({ title, value, change, subtitle }) {
  const up = (change || 0) >= 0;
  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>

        <div className="text-sm text-right">
          <div
            className={`inline-flex items-center px-2 py-1 rounded text-white ${
              up ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {up ? "▲" : "▼"} {Math.abs(change || 0)}%
          </div>
        </div>
      </div>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}
