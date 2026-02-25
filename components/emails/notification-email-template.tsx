import * as React from "react";

interface NotificationEmailProps {
  userName: string;
  type: "SUCCESS" | "FAILURE";
  videoTitle?: string;
  url: string;
}

export function NotificationEmail({
  userName,
  type,
  videoTitle,
  url,
}: NotificationEmailProps) {
  const isSuccess = type === "SUCCESS";

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px",
        backgroundColor: "#f9fafb",
        borderRadius: "12px",
        maxWidth: "600px",
        margin: "0 auto",
        color: "#111827",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 12px" }}>
          {isSuccess
            ? "Video Generation Successful!"
            : "Video Generation Failed"}
        </h1>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            margin: "0",
            color: "#4b5563",
          }}
        >
          Hi {userName},
        </p>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            margin: "12px 0",
            color: "#4b5563",
          }}
        >
          {isSuccess
            ? `Fantastic news! Your video "${videoTitle || "Untitled"}" has been generated successfully and is ready to watch.`
            : `We're sorry, but there was an error generating your video "${videoTitle || "Untitled"}". Our team has been notified.`}
        </p>
      </div>

      <a
        href={url}
        style={{
          display: "inline-block",
          backgroundColor: isSuccess ? "#000" : "#ef4444",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "16px",
        }}
      >
        {isSuccess ? "Watch Video" : "Go to Dashboard"}
      </a>

      <div
        style={{
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0" }}>
          Flickzo - Your ultimate short video generator.
        </p>
      </div>
    </div>
  );
}
