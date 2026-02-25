import { render, screen } from "@testing-library/react";
import { Logo } from "@/components/logo";

describe("Logo", () => {
  it("renders the app name", () => {
    render(<Logo />);
    expect(screen.getByText(/flickzo/i)).toBeInTheDocument();
  });
});
