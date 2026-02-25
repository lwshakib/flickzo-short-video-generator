import { render, screen } from "@testing-library/react";
import VerifyEmailPage from "@/app/(auth)/verify-email/page";

const mockGet = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

describe("VerifyEmailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders check your email heading when state is sent", () => {
    mockGet.mockImplementation((key) => {
      if (key === "state") return "sent";
      return null;
    });

    render(<VerifyEmailPage />);

    expect(
      screen.getByRole("heading", { name: /check your email/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /go to gmail/i })
    ).toBeInTheDocument();
  });

  it("renders success heading when state is verified", () => {
    mockGet.mockImplementation((key) => {
      if (key === "state") return "verified";
      return null;
    });

    render(<VerifyEmailPage />);

    expect(
      screen.getByRole("heading", { name: /email verified successfully/i })
    ).toBeInTheDocument();
  });
});
