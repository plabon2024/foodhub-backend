import cors from "cors";
import express, { Application } from "express";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { authRouter } from "./modules/auth/auth.router";
import { providerRoutes } from "./modules/provider/provider.router";
export const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/auth", authRouter);
app.all("/api/auth/*splat", toNodeHandler(auth));
// Provider Management
app.use("/api/provider", providerRoutes);


app.get("/", (req, res) => {
  res.send("hello world");
});
