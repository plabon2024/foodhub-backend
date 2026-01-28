import express, { Application } from "express";
import cors from "cors";
import { mealRoute } from "./modules/meals/meals.router";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { providerRoutes } from "./modules/provider/provider.router";
import { authRoutes } from "./modules/auth/auth.router";
export const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/provider", mealRoute);
app.use("/api/provider", providerRoutes);


app.get("/", (req, res) => {
  res.send("hello world");
});
