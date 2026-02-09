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
  trustedOrigins: [
    "http://localhost:3000",
    "https://foodhub-frontend-sepia.vercel.app",
    ...(process.env.APP_URL ? [process.env.APP_URL] : []),
  ],

  user: {
    additionalFields: {
      role: {
        type: ["CUSTOMER", "PROVIDER", "ADMIN"],
        required: true,
        defaultValue: "CUSTOMER",
      },
      status: {
        type: ["ACTIVE", "SUSPENDED"],
        defaultValue: "ACTIVE",
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      await transporter.sendMail({
        from: `"FoodHub 🍱" <${process.env.MAIL_USER}>`,
        to: user.email,
        subject: "Verify your FoodHub email address",
        text: `Verify your FoodHub account: ${url}`,
        html: verificationEmailTemplate({
          name: user.name ?? "there",
          verifyUrl: url,
        }),
      });
    },

    callbackURL: "/auth/verify",
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowedRole =
            user.role === "PROVIDER" ? "PROVIDER" : "CUSTOMER";
          const [firstName = null, lastName = null] =
            user.name?.split(" ") ?? [];

          return {
            data: {
              ...user,
              role: allowedRole,
              firstName,
              lastName,
            },
          };
        },

        after: async (user) => {
          if (user.role !== "PROVIDER") return;
          await prisma.providerProfile.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              name: user.name ?? "",
            },
            update: {},
          });
        },
      },
    },
  }, session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    cookie: {
      sameSite: "none", // ✅ REQUIRED FOR CROSS DOMAIN
      secure: true,     // ✅ REQUIRED (HTTPS)
    },
  },


});
