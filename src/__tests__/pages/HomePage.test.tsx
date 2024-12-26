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
    expect(screen.getByText("Welcome to Smart Todo List")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your tasks efficiently and effortlessly.")
    ).toBeInTheDocument();
  });

  it("renders the EmailInput component", () => {
    render(<HomePage />);
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });

  it("applies the correct styles to typography", () => {
    render(<HomePage />);
    const title = screen.getByText("Welcome to Smart Todo List");
    const computedTitleStyle = window.getComputedStyle(title);
    expect(computedTitleStyle.fontWeight).toBe("700"); // "bold"
    expect(computedTitleStyle.color).toBe("rgb(25, 118, 210)"); // Hex #1976d2 in rgb

    const subtitle = screen.getByText(
      "Manage your tasks efficiently and effortlessly."
    );
    const computedSubtitleStyle = window.getComputedStyle(subtitle);
    expect(computedSubtitleStyle.color).toBe("rgb(97, 97, 97)"); // Hex #616161 in rgb
  });
});
