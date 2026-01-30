import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { verificationEmailTemplate } from "../emails/verificationEmail";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: ["http://localhost:3000"],

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,

  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
 
      await transporter.sendMail({
        from: `"FoodHub 🍱" <${process.env.user}>`,
        to: user.email,
        subject: "Verify your FoodHub email address",
        text: `Verify your FoodHub account: ${url}`,
        html: verificationEmailTemplate({
          name: user.name,
          verifyUrl: String(url), // ✅ Use original url, not link
        }),
      });
    },
    callbackURL: "/auth/verify",
  },


});
