import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { emailService } from "@/services/email.services";
import { AuthEmailTemplate } from "@/components/emails/auth-email-template";

// Create and export the configured authentication service instance.
export const auth = betterAuth({
  // Use Prisma as the database adapter to persist user accounts, sessions, and social connections directly into our PostgreSQL database.
  database: prismaAdapter(prisma, {
    provider: "postgresql", // Matches the Prisma provider type defined in schema.prisma.
  }),

  // Enable standard email and password authentication methods.
  emailAndPassword: {
    enabled: true, // Allow users to sign up and log in using an email and password.
    requireEmailVerification: true, // Prevent users from logging in until they have clicked the verification link sent to their email.

    // Custom asynchronous callback triggered when a user requests a password reset.
    sendResetPassword: async ({ user, url }) => {
      try {
        // Attempt to dispatch the password reset email via EmailService
        await emailService.sendEmail({
          from: "Flickzo <noreply@lwshakib.site>",
          to: user.email,
          subject: "Reset your password",
          react: AuthEmailTemplate({ type: "forgot-password", url }),
        });

      } catch (err) {
        // Catch network errors or unexpected exceptions during the email sending process
        console.error("Resend error:", err);
        throw err;
      }
    },
  },

  // Configure OAuth providers allowing fast, passwordless onboarding.
  socialProviders: {
    google: {
      enabled: true, // Activate "Sign in with Google" strategy.
      // Load Google API credentials from secure environment variables.
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Settings pertaining to the email verification lifecycle.
  emailVerification: {
    sendOnSignUp: true, // Automatically trigger the verification email immediately after a successful signup registration.
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/verify-email?state=verified`, // The URL to redirect to after successful verification.

    // Custom asynchronous callback triggered to deliver the verification link to the newly registered user.
    sendVerificationEmail: async ({ user, url }) => {
      try {
        // Dispatch the account verification email via EmailService.
        await emailService.sendEmail({
          from: "Flickzo <noreply@lwshakib.site>",
          to: user.email,
          subject: "Verify your email address",
          react: AuthEmailTemplate({ type: "email-verification", url }),
        });
      } catch (err) {
        // Log errors to the server console if the verification email fails to send (fails silently for the end user)
        console.error("Verification email error:", err);
      }
    },
  },

  account: {
    accountLinking: {
      enabled: true, // Enables linking multiple identity providers (Google, Email) to a single user account context if the emails match.
    },
  },
});
