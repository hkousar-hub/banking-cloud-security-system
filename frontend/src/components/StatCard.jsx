const StatCard = ({ title, value, color }) => {
  return (
    <div style={{
      background: "#1e293b",
      padding: "18px",
      borderRadius: "12px",
      borderLeft: `4px solid ${color}`,
      color: "white",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.05)"
    }}>
      <div style={{
        fontSize: "13px",
        opacity: 0.7
      }}>
        {title}
      </div>

      <div style={{
        fontSize: "26px",
        fontWeight: "600",
        marginTop: "5px"
      }}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;