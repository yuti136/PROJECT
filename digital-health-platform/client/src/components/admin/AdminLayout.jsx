import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "#1f2937",
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Admin Panel</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/admin" style={{ color: "white" }}>Dashboard</Link>
          <Link to="/admin/users" style={{ color: "white" }}>Users</Link>
          <Link to="/admin/providers" style={{ color: "white" }}>Providers</Link>
          <Link to="/admin/patients" style={{ color: "white" }}>Patients</Link>
          <Link to="/admin/appointments" style={{ color: "white" }}>Appointments</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px" }}>
        {children}
      </main>
    </div>
  );
}
