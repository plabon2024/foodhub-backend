import express, { Application } from "express";
import cors from "cors";
import { mealRoute } from "./modules/meals/meals.router";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
export const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  }),
);

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/provider", mealRoute);

app.get("/", (req, res) => {
  res.send("hello world");
});
