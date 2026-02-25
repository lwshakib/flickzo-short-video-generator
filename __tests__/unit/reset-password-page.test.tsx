import { render, screen } from "@testing-library/react";
import ResetPasswordPage from "@/app/(auth)/reset-password/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation((key) => {
      if (key === "token") return "test-token";
      return null;
    }),
  }),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    resetPassword: jest.fn().mockResolvedValue({ error: null }),
  },
}));

describe("ResetPasswordPage", () => {
  it("renders set new password heading and password fields", () => {
    render(<ResetPasswordPage />);

    expect(
      screen.getByRole("heading", { name: /set new password/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument();
  });
});
