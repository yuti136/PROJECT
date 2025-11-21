export default function Dashboard() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Panel</p>

      {/* --- CHAT SHORTCUT BUTTON --- */}
      <div style={{ marginTop: "20px" }}>
        <a
          href="/chat"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          💬 Open Chat
        </a>
      </div>

      {/* --- METRICS GRID --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            padding: "20px",
            background: "#e5e7eb",
            borderRadius: "8px",
          }}
        >
          <h2>Total Users</h2>
        </div>

        <div
          style={{
            padding: "20px",
            background: "#e5e7eb",
            borderRadius: "8px",
          }}
        >
          <h2>Total Providers</h2>
        </div>

        <div
          style={{
            padding: "20px",
            background: "#e5e7eb",
            borderRadius: "8px",
          }}
        >
          <h2>Total Patients</h2>
        </div>

        <div
          style={{
            padding: "20px",
            background: "#e5e7eb",
            borderRadius: "8px",
          }}
        >
          <h2>Total Appointments</h2>
        </div>
      </div>
    </div>
  );
}
