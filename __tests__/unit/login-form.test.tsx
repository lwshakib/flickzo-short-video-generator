import { render, screen } from "@testing-library/react";
import { LoginForm } from "@/components/login-form";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: jest.fn().mockResolvedValue({ error: null }),
      social: jest.fn().mockResolvedValue({}),
    },
  },
}));

describe("LoginForm", () => {
  it("renders heading, fields and primary button", () => {
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: /login to flickzo/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /^login$/i })
    ).toBeInTheDocument();
  });
});
