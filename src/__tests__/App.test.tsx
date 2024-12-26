import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import App from "../App";

// Mock pages
jest.mock("../pages/HomePage", () => () => (
  <div data-testid="home-page">Mocked HomePage</div>
));
jest.mock("../pages/TaskPage", () => () => (
  <div data-testid="task-page">Mocked TaskPage</div>
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

  it("renders the TaskPage for the '/tasks' route", () => {
    window.history.pushState({}, "TaskPage", "/tasks");
    renderWithProviders(<App />);
    expect(screen.getByTestId("task-page")).toBeInTheDocument();
  });

  it("does not render HomePage when on '/tasks' route", () => {
    window.history.pushState({}, "TaskPage", "/tasks");
    renderWithProviders(<App />);
    expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
  });

  it("does not render TaskPage when on '/' route", () => {
    window.history.pushState({}, "HomePage", "/");
    renderWithProviders(<App />);
    expect(screen.queryByTestId("task-page")).not.toBeInTheDocument();
  });
});
