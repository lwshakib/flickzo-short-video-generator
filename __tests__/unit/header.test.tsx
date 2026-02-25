import { render, screen } from "@testing-library/react";
import { HeroHeader } from "@/components/header";

describe("HeroHeader", () => {
  it("renders Logo and navigation links", () => {
    render(<HeroHeader />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();

    // Check for some menu items
    expect(screen.getAllByText(/features/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/pricing/i).length).toBeGreaterThan(0);

    // Check for auth buttons
    expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/sign up/i).length).toBeGreaterThan(0);
  });
});
