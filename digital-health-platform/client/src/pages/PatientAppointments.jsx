// client/src/pages/PatientAppointments.jsx

import { useEffect, useState } from "react";
import { createAppointment, getAppointments } from "../services/appointments";
import { getProviders } from "../services/users";
import Navbar from "@/components/Navbar";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [date, setDate] = useState("");

  const token = localStorage.getItem("token");

  const loadProviders = async () => {
    const data = await getProviders(token);
    setProviders(data);
  };

  const loadAppointments = async () => {
    const data = await getAppointments(token);
    setAppointments(data);
  };

  useEffect(() => {
    loadProviders();
    loadAppointments();
  }, []);

  const handleCreate = async () => {
    if (!providerId || !date) {
      alert("Please choose provider and date");
      return;
    }

    // 🔥 SAVE PROVIDER ID FOR CHAT
    localStorage.setItem("providerId", providerId);

    const result = await createAppointment(token, {
      provider: providerId,
      scheduledAt: date,
    });

    alert(result.message);
    loadAppointments();
  };

  return (
    <>
      <Navbar />

      <div className="p-4 max-w-3xl mx-auto">
        {/* BOOK AN APPOINTMENT */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle>Book an Appointment</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="text-sm">Select Provider</label>
              <Select onValueChange={setProviderId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider._id} value={provider._id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm">Date & Time</label>
              <Input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button className="w-full" onClick={handleCreate}>
              Book Appointment
            </Button>
          </CardContent>
        </Card>

        {/* APPOINTMENTS LIST */}
        <h2 className="text-lg font-semibold mb-2">Your Appointments</h2>

        <div className="space-y-3">
          {appointments.map((appt) => (
            <Card
              key={appt._id}
              className="p-3 border-l-4 border-blue-500 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {new Date(appt.scheduledAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span
                    className={
                      appt.status === "accepted"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {appt.status}
                  </span>
                </p>
              </div>

              {/* Join Call Button */}
              {appt.status === "accepted" && (
                <Button
                  className="bg-blue-600 text-white"
                  onClick={() => {
                    window.location.href = `/call/${appt._id}`;
                  }}
                >
                  Join Call
                </Button>
              )}
            </Card>
          ))}

          {appointments.length === 0 && (
            <p className="text-gray-500 text-sm">No appointments yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PatientAppointments;
