import { render, screen } from "@testing-library/react";
import SignUpPage from "@/app/(auth)/sign-up/page";

jest.mock("@/components/signup-form", () => ({
  SignUpForm: () => <div data-testid="signup-form">Sign Up Form</div>,
}));

describe("SignUpPage", () => {
  it("renders Logo and SignUpForm", () => {
    render(<SignUpPage />);

    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /flickzo/i })).toBeInTheDocument();
  });
});
