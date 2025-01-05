import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import App from "../App";

// Mock pages
jest.mock("../pages/HomePage", () => () => (
  <div data-testid="home-page">Mocked HomePage</div>
));
jest.mock("../pages/WeatherPage", () => () => (
  <div data-testid="weather-page">Mocked WeatherPage</div>
));

describe("App Component", () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  it("renders the HomePage for the root route '/'", () => {
    window.history.pushState({}, "HomePage", "/");
    renderWithProviders(<App />);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("renders the WeatherPage for the '/weather' route", () => {
    window.history.pushState({}, "WeatherPage", "/weather");
    renderWithProviders(<App />);
    expect(screen.getByTestId("weather-page")).toBeInTheDocument();
  });

  it("does not render HomePage when on '/weather' route", () => {
    window.history.pushState({}, "WeatherPage", "/");
    renderWithProviders(<App />);
    expect(screen.queryByTestId("weather-page")).not.toBeInTheDocument();
  });

  it("does not render WeatherPage when on '/' route", () => {
    window.history.pushState({}, "HomePage", "/");
    renderWithProviders(<App />);
    expect(screen.queryByTestId("weather-page")).not.toBeInTheDocument();
  });
});
