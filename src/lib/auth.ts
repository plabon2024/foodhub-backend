import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import nodemailer from "nodemailer";
import { prisma } from "./prisma";
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
       provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URl as string],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "CUSTOMER",
                required: false,
            },
      
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        },
    },
    emailAndPassword: {

        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    }
    // ,
    // emailVerification: {
    //     sendOnSignUp: true,
    //     autoSignInAfterVerification: true,
    //     sendVerificationEmail: async ({ user, url, token }, request) => {
    //         try {
    //             const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;



    //             const info = await transporter.sendMail({
    //                 from: "blog",
    //                 to: user.email,
    //                 subject: "Verify Your Email Address",
    //                 text: 'hi',
    //                 html: 'hi',
    //             });

    //             console.log("Message sent:", info.messageId);

    //         } catch (error) {
    //             console.log(error)
    //             throw error
    //         }
    //     },
    // }
    , socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            accessType: "offline",
            prompt: "select_account consent",
        },
    },
});
