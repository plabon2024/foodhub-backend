import { Router } from "express";
import { auth } from "../../lib/auth";

export const authRoutes = Router();

// ✅ Handle verification callback and redirect to frontend
authRoutes.get("/verify", async (req, res) => {
  const { token, error } = req.query;

  if (error) {
    // Redirect to frontend with error
    return res.redirect(
      `${process.env.APP_URL}/auth/verify?error=${error}`
    );
  }

  if (token) {
    // Redirect to frontend with token (frontend will handle the actual verification)
    return res.redirect(
      `${process.env.APP_URL}/auth/verify?token=${token}`
    );
  }

  // No token or error - something went wrong
  res.redirect(
    `${process.env.APP_URL}/auth/verify?error=missing_token`
  );
});