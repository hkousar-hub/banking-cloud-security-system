import { useEffect, useState } from "react";
import axios from "axios";
import MapView from "../components/MapView";
import StatCard from "../components/StatCard";
import SuspiciousList from "../components/SuspiciousList";
import LogsTable from "../components/LogsTable";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [suspicious, setSuspicious] = useState([]);
  const [geoData, setGeoData] = useState([]);

  useEffect(() => {
    fetchLogs();
    fetchSuspicious();
    fetchGeo();
  }, []);

  const fetchLogs = async () => {
    const res = await axios.get("http://localhost:5000/api/logs");
    setLogs(res.data);
  };

  const fetchSuspicious = async () => {
    const res = await axios.get("http://localhost:5000/api/suspicious");
    setSuspicious(res.data);
  };

  const fetchGeo = async () => {
    const res = await axios.get("http://localhost:5000/api/geo-logs");
    setGeoData(res.data);
  };

  const blockIP = async (ip) => {
    await axios.post("http://localhost:5000/api/block-ip", { ip });
    alert("Blocked 🚫");
  };

  const success = logs.filter(l => l.status === "success").length;
  const failed = logs.filter(l => l.status === "failed").length;

  const chartData = {
    labels: ["Success", "Failed"],
    datasets: [
      {
        label: "Login Attempts",
        data: [success, failed],
         backgroundColor: [
        "#22c55e", // success green
        "#ef4444"  // failed red
      ],
      borderRadius: 6,
      barThickness: 40
      }
    ]
    
  };
  const options = {
  plugins: {
    legend: {
      labels: {
        color: "white"
      }
    }
  },
  scales: {
    x: {
      ticks: { color: "white" }
    },
    y: {
      ticks: { color: "white" }
    }
  }
};

  return (
    <div style={container}>

      <h1 style={header}>
        👑 Security Dashboard
      </h1>

      <div style={grid4}>
        <StatCard title="Total Logs" value={logs.length} color="#3b82f6" />
        <StatCard title="Failed" value={failed} color="#ef4444" />
        <StatCard title="Success" value={success} color="#22c55e" />
        <StatCard title="Suspicious" value={suspicious.length} color="#f59e0b" />
      </div>

      <div style={grid2}>
        <div style={card}>
          <h3>📊 Login Attempts</h3>
         <Bar data={chartData} options={options} />
        </div>

        <SuspiciousList suspicious={suspicious} />
      </div>

      <div style={card}>
        <h3>🌍 Attack Map</h3>
        <MapView locations={geoData} />
      </div>

      <LogsTable logs={logs} blockIP={blockIP} />

    </div>
  );
};

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
  background: "#0f172a",
  minHeight: "100vh",
  color: "white"
};

const header = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#38bdf8"
};

const grid4 = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "20px",
  marginBottom: "25px"
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "2.5fr 1fr",
  gap: "20px",
  marginBottom: "25px"
};

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.05)"
};

export default Dashboard;