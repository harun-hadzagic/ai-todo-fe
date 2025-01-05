import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "../../pages/HomePage";

// Mock the EmailInput component
jest.mock("../../components/EmailInput", () => () => (
  <div data-testid="email-input"> Mocked EmailInput </div>
));

describe("HomePage", () => {
  it("renders the container with proper styling", async () => {
    render(<HomePage />);
    const container = await screen.findByRole("main");
    expect(container).toBeInTheDocument();
  });

  it("renders the welcome message", () => {
    render(<HomePage />);
    expect(screen.getByText("Welcome to Weather App")).toBeInTheDocument();
    expect(
      screen.getByText("Look up weather forcasts effortlessly.")
    ).toBeInTheDocument();
  });

  it("renders the EmailInput component", () => {
    render(<HomePage />);
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });

  it("applies the correct styles to typography", () => {
    render(<HomePage />);
    const title = screen.getByText("Welcome to Weather App");
    expect(title).toHaveStyle({
      fontWeight: 700,
      color: "#1976d2",
    });

    const subtitle = screen.getByText(
      "Look up weather forcasts effortlessly."
    );
    expect(subtitle).toHaveStyle({
      color: "#616161",
    });
  });
});
