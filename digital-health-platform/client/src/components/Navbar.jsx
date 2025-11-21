import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const role = localStorage.getItem("role");

  // Hide navbar on login page
  if (location.pathname === "/login") {
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-white shadow-sm p-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-blue-600">Digital Health Platform</h2>

      <div className="space-x-4 flex items-center">

        {/* Patient Links */}
        {role === "patient" && (
          <>
            <a
              href="/appointments/patient"
              className="text-gray-700 hover:text-blue-600"
            >
              My Appointments
            </a>

            {/* Chat link */}
            <a
              href="/chat"
              className="text-gray-700 hover:text-blue-600"
            >
              Chat
            </a>
          </>
        )}

        {/* Provider Links */}
        {role === "provider" && (
          <>
            <a
              href="/appointments/provider"
              className="text-gray-700 hover:text-blue-600"
            >
              Consultations
            </a>

            {/* Chat link */}
            <a
              href="/chat"
              className="text-gray-700 hover:text-blue-600"
            >
              Chat
            </a>
          </>
        )}

        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
