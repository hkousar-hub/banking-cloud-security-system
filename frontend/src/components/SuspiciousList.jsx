const SuspiciousList = ({ suspicious }) => {
  return (
    <div style={card}>
      <h3 style={title}>🚨 Suspicious IPs</h3>

      {suspicious.map((s, i) => (
        <div key={i} style={item}>
          {s.ip} ({s.attempts})
        </div>
      ))}
    </div>
  );
};

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  color: "white",
  height: "100%",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.05)"
};

const title = {
  marginBottom: "10px"
};

const item = {
  padding: "10px",
  borderBottom: "1px solid #334155"
};

export default SuspiciousList;