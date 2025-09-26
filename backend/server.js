require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/experiences", require("./routes/experiences"));
app.use("/api/bookings", require("./routes/bookings"));

// simple health
app.get("/api/health", (req,res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log("Server on",PORT));
