import { Resend } from "resend";
import { NotificationEmail } from "@/components/emails/notification-email-template";

const DEFAULT_FROM = "Flickzo <noreply@lwshakib.site>";

// Resend throws if neither a constructor key nor RESEND_API_KEY is set; Next.js
// evaluates this module during `next build` without a real key in CI.
const resend = new Resend(
  process.env.RESEND_API_KEY ?? "re_local_build_placeholder_not_for_sending",
);

export async function sendSuccessEmail(
  email: string,
  userName: string,
  videoTitle: string,
  videoId: string
): Promise<void> {
  await resend.emails.send({
    from: DEFAULT_FROM,
    to: email,
    subject: "Your video is ready!",
    react: NotificationEmail({
      userName,
      type: "SUCCESS",
      videoTitle,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/videos/${videoId}`,
    }),
  });
}

export async function sendFailureEmail(
  email: string,
  userName: string,
  videoTitle: string
): Promise<void> {
  await resend.emails.send({
    from: DEFAULT_FROM,
    to: email,
    subject: "Video generation failed",
    react: NotificationEmail({
      userName,
      type: "FAILURE",
      videoTitle,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
    }),
  });
}

export async function sendEmail(
  options: Parameters<(typeof resend)["emails"]["send"]>[0]
): Promise<void> {
  await resend.emails.send(options);
}
