import express from "express";
import "./env.js";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import serviceRoutes from "./routes/service.routes.js";
import incidentRoutes from "./routes/incident.routes.js";
import { initSocket } from "./socket/index.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

initSocket(io);

app.use(cors());
app.use(express.json());

app.use("/api/services", serviceRoutes(io));
app.use("/api/incidents", incidentRoutes(io));
app.use("/api/public", publicRoutes);
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log("✅ Backend running on port ${PORT}"));
  })
  .catch(err => console.error("Mongo error:", err));
