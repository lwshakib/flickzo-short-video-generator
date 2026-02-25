/**
 * AuthLayout component.
 * Provides a consistent layout for all authentication-related pages
 * (sign-in, sign-up, password reset, etc.).
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Simple wrapper that ensures auth pages take up the full screen height
  return <div className="min-h-screen w-full">{children}</div>;
}
