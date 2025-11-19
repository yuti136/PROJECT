// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import MetricCard from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import Chart from "react-apexcharts";
import { getAppointmentAnalytics } from "../services/analytics";
import { getAppointments } from "../services/appointments";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 124,
    todaysAppointments: 8,
    upcomingAppointments: 22,
    completed: 56,
  });

  const [recent, setRecent] = useState([]);

  // NEW: chart data state
  const [chartData, setChartData] = useState({
    dates: [],
    counts: [],
  });

  // Load recent appointments (existing)
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const appts = await getAppointments(token);
        setRecent(appts.slice(0, 6));
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  // NEW: Load analytics for chart (last 30 days)
  useEffect(() => {
    async function loadAnalytics() {
      try {
        const token = localStorage.getItem("token");
        const analytics = await getAppointmentAnalytics(token);

        const dates = analytics.last30Days.map((d) => d.date);
        const counts = analytics.last30Days.map((d) => d.count);

        setChartData({ dates, counts });
      } catch (err) {
        console.error("Analytics load error:", err);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Patients"
            value={stats.totalPatients}
            change={4}
            subtitle="All time registered patients"
          />
          <MetricCard
            title="Today's Appointments"
            value={stats.todaysAppointments}
            change={-8}
            subtitle="Appointments scheduled for today"
          />
          <MetricCard
            title="Upcoming"
            value={stats.upcomingAppointments}
            change={12}
            subtitle="Next 7 days"
          />
          <MetricCard
            title="Completed"
            value={stats.completed}
            change={3}
            subtitle="Completed consultations"
          />
        </div>

        {/* Middle section: chart + recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart card */}
          <div className="lg:col-span-2">
            <Card className="h-[300px] p-4">
              <h3 className="text-lg font-semibold mb-2">
                Appointments (last 30 days)
              </h3>

              <Chart
                type="area"
                height="250"
                series={[
                  {
                    name: "Appointments",
                    data: chartData.counts,
                  },
                ]}
                options={{
                  chart: { toolbar: { show: false }, zoom: { enabled: false } },
                  xaxis: {
                    categories: chartData.dates,
                    labels: { rotate: -45 },
                  },
                  stroke: { curve: "smooth" },
                  colors: ["#2563eb"],
                  dataLabels: { enabled: false },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 0.5,
                      opacityFrom: 0.5,
                      opacityTo: 0.0,
                    },
                  },
                }}
              />
            </Card>
          </div>

          {/* Recent activity */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>

            <ul className="space-y-3">
              {recent.length === 0 && (
                <li className="text-sm text-gray-500">No recent activity</li>
              )}

              {recent.map((r) => (
                <li key={r._id} className="p-2 border rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">
                        {r.patient?.name || "Unknown Patient"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.scheduledAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-sm">
                      <span
                        className={
                          r.status === "accepted"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Bottom quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-2">Quick Actions</h4>
            <div className="space-y-2">
              <a
                href="/appointments/patient"
                className="text-blue-600 hover:underline block"
              >
                Book a new appointment
              </a>
              <a
                href="/appointments/provider"
                className="text-blue-600 hover:underline block"
              >
                See provider requests
              </a>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-2">System Status</h4>
            <p className="text-sm text-gray-600">All systems nominal</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
