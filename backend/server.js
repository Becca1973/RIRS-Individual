const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// API poti
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 23077;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
