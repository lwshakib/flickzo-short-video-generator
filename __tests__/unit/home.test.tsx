import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock the components used in Home to keep the test focused or if they have complex logic/animations
jest.mock("@/components/hero-section", () => {
  return function MockHeroSection() {
    return (
      <section>
        <h1>Architect Cinematic Stories with AI</h1>
      </section>
    );
  };
});
jest.mock(
  "@/components/features",
  () =>
    function MockFeatures() {
      return <section>Features</section>;
    }
);
jest.mock(
  "@/components/how-it-works",
  () =>
    function MockHowItWorks() {
      return <section>How It Works</section>;
    }
);
jest.mock(
  "@/components/pricing",
  () =>
    function MockPricing() {
      return <section>Pricing</section>;
    }
);
jest.mock(
  "@/components/faq",
  () =>
    function MockFAQ() {
      return <section>FAQ</section>;
    }
);
jest.mock(
  "@/components/footer",
  () =>
    function MockFooter() {
      return <footer>Footer</footer>;
    }
);

describe("Home Page", () => {
  it("renders the hero section heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /architect cinematic stories with ai/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
