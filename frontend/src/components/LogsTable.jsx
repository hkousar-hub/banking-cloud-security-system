const LogsTable = ({ logs, blockIP }) => {
  return (
    <div style={card}>
      <h3>📜 Login Logs</h3>

      <table style={table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>IP</th>
            <th>Status</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td style={td}>{log.email}</td>
              <td style={td}>{log.ip}</td>

              <td style={td}>
                <span style={{
                  color: log.status === "failed"
                    ? "#ef4444"
                    : "#22c55e"
                }}>
                  {log.status}
                </span>
              </td>

              <td style={td}>{log.timestamp}</td>

              <td style={td}>
                <button
                  onClick={() => blockIP(log.ip)}
                  style={btn}
                >
                  Block
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  color: "white",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.05)"
};

const table = {
  width: "100%",
  marginTop: "10px",
  borderCollapse: "collapse"
};

const td = {
  padding: "10px"
};

const btn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};

export default LogsTable;