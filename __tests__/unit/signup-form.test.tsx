import { render, screen } from "@testing-library/react";
import { SignUpForm } from "@/components/signup-form";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signUp: {
      email: jest.fn().mockResolvedValue({ error: null }),
    },
    signIn: {
      social: jest.fn().mockResolvedValue({}),
    },
  },
}));

describe("SignUpForm", () => {
  it("renders heading, fields and primary button", () => {
    render(<SignUpForm />);

    expect(
      screen.getByRole("heading", { name: /join flickzo today/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /^sign up$/i })
    ).toBeInTheDocument();
  });
});
