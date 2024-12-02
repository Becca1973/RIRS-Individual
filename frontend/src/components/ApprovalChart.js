import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  BarElement,
  LinearScale,
  Tooltip,
} from "chart.js";
import { getUserRequestStatuses } from "../api/requestApi";
import { Box, Typography, CircularProgress } from "@mui/material";

Chart.register(CategoryScale, BarElement, LinearScale, Tooltip);

const ApprovalChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getUserRequestStatuses();

        if (Array.isArray(stats) && stats.length > 0) {
          const names = stats.map((stat) => `${stat.ime} ${stat.priimek}`);
          const approvals = stats.map((stat) => stat.odobreniDopusti || 0);

          setChartData({
            labels: names,
            datasets: [
              {
                label: "Used Leave (Days)",
                data: approvals,
                backgroundColor: "#5fa9fd",
                borderColor: "rgba(135,206,250,1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError("No data available for approved leaves.");
        }
      } catch (error) {
        console.error("Error fetching user request statuses:", error);
        setError("Failed to fetch data.");
      }
    };

    fetchStats();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "980px",
        margin: "auto",
        padding: "2rem",
        boxShadow: 3,
        borderRadius: 2,
        marginTop: "40px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="h5" component="h3" sx={{ marginBottom: "1rem" }}>
        Leave Usage Chart
      </Typography>
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : chartData ? (
        <Box sx={{ height: "400px" }}>
          {/* Render the names and approvals for testing */}
          <Box sx={{ marginBottom: "1rem" }}>
            {chartData.labels.map((name, index) => (
              <Typography
                key={index}
              >{`${name}: ${chartData.datasets[0].data[index]} dni dopusta`}</Typography>
            ))}
          </Box>

          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 30,
                  title: {
                    display: true,
                    text: "Število dni dopusta",
                  },
                  ticks: {
                    color: "#333",
                  },
                },
                x: {
                  ticks: {
                    color: "#333",
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const value = tooltipItem.raw;
                      return `Dni dopusta: ${value}`;
                    },
                  },
                },
              },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ApprovalChart;
