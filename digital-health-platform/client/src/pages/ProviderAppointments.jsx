// client/src/pages/ProviderAppointments.jsx

import { useEffect, useState } from "react";
import {
  getAppointments,
  acceptAppointment,
  rejectAppointment,
} from "../services/appointments";
import Navbar from "@/components/Navbar";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function ProviderAppointments() {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  const loadAppointments = async () => {
    const data = await getAppointments(token);
    setAppointments([...data].reverse());
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleAccept = async (id) => {
    const result = await acceptAppointment(token, id);
    alert(result.message);
    loadAppointments();
  };

  const handleReject = async (id) => {
    const confirmReject = confirm("Are you sure you want to reject this appointment?");
    if (!confirmReject) return;

    const result = await rejectAppointment(token, id);
    alert(result.message);
    loadAppointments();
  };

  return (
    <>
      <Navbar />

      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Incoming Appointments</h2>

        <div className="space-y-3">
          {appointments.map((appt) => (
            <Card
              key={appt._id}
              className={`p-3 border-l-4 ${
                appt.status === "requested"
                  ? "border-yellow-500"
                  : appt.status === "accepted"
                  ? "border-green-600"
                  : "border-red-600"
              }`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {new Date(appt.scheduledAt).toLocaleString()}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Patient:</span>{" "}
                  {appt.patient?.name}
                </p>

                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={
                      appt.status === "requested"
                        ? "text-yellow-600"
                        : appt.status === "accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {appt.status}
                  </span>
                </p>

                {/* Buttons for requested appointments */}
                {appt.status === "requested" && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      className="bg-green-600"
                      onClick={() => handleAccept(appt._id)}
                    >
                      Accept
                    </Button>

                    <Button
                      className="bg-red-600 text-white"
                      onClick={() => handleReject(appt._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {/* Start Call Button */}
                {appt.status === "accepted" && (
                  <Button
                    className="mt-3 bg-blue-600 text-white"
                    onClick={() => {
                      window.location.href = `/call/${appt._id}`;
                    }}
                  >
                    Start Call
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          {appointments.length === 0 && (
            <p className="text-gray-500 text-sm">
              No appointments available.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default ProviderAppointments;
