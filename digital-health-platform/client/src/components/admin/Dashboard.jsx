export default function Dashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Panel</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginTop: "30px"
      }}>
        <div style={{ padding: "20px", background: "#e5e7eb", borderRadius: "8px" }}>
          <h2>Total Users</h2>
        </div>

        <div style={{ padding: "20px", background: "#e5e7eb", borderRadius: "8px" }}>
          <h2>Total Providers</h2>
        </div>

        <div style={{ padding: "20px", background: "#e5e7eb", borderRadius: "8px" }}>
          <h2>Total Patients</h2>
        </div>

        <div style={{ padding: "20px", background: "#e5e7eb", borderRadius: "8px" }}>
          <h2>Total Appointments</h2>
        </div>
      </div>
    </div>
  );
}
