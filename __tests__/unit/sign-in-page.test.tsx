import { render, screen } from "@testing-library/react";
import SignInPage from "@/app/(auth)/sign-in/page";

jest.mock("@/components/login-form", () => ({
  LoginForm: () => <div data-testid="login-form">Login Form</div>,
}));

describe("SignInPage", () => {
  it("renders Logo and LoginForm", () => {
    render(<SignInPage />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /flickzo/i })).toBeInTheDocument();
  });
});
