import { Resend } from "resend";
import { NotificationEmail } from "@/components/emails/notification-email-template";

class EmailServiceClass {
  private resend = new Resend(process.env.RESEND_API_KEY);
  private defaultFrom = "Flickzo <noreply@lwshakib.site>";

  public async sendSuccessEmail(
    email: string,
    userName: string,
    videoTitle: string,
    videoId: string
  ): Promise<void> {
    await this.resend.emails.send({
      from: this.defaultFrom,
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

  public async sendFailureEmail(
    email: string,
    userName: string,
    videoTitle: string
  ): Promise<void> {
    await this.resend.emails.send({
      from: this.defaultFrom,
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

  // Generic method if needed for other templates missing defined static methods
  public async sendEmail(options: any): Promise<void> {
    await this.resend.emails.send(options);
  }
}

export const emailService = new EmailServiceClass();
