import express from "express";
import cors from "cors";
import { createServer } from "http";
import { env } from "./config/env.js";
import { setupSocketIO } from "./services/socket.service.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { prisma } from "./db/prisma.js";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import conversationsRoutes from "./routes/conversations.routes.js";
import messagesRoutes from "./routes/messages.routes.js";

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);

app.get("/db-check", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.send("DB connected");
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use(errorHandler);

setupSocketIO(httpServer);

httpServer.listen(env.port, () => {
  console.log(`✅ Server running on http://localhost:${env.port}`);
  console.log(`🔌 WebSocket server ready`);
});
