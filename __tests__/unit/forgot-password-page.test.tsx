import { render, screen } from "@testing-library/react";
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page";

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    requestPasswordReset: jest.fn().mockResolvedValue({ error: null }),
  },
}));

describe("ForgotPasswordPage", () => {
  it("renders reset password heading and email field", () => {
    render(<ForgotPasswordPage />);

    expect(
      screen.getByRole("heading", { name: /reset password/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeInTheDocument();
  });
});
