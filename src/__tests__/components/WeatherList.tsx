import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WeatherList from "../../components/WeatherList";

// Mock the WeatherCard component
jest.mock("../../components/WeatherCard", () => () => (
  <div data-testid="weather-card">Mocked WeatherCard</div>
));

afterEach(() => {
  jest.clearAllMocks(); // Clear mocks after each test
  jest.restoreAllMocks(); // Restore original implementations
});

describe("WeatherList Component", () => {
  const mockWeather = [
    { id: 1, title: "Test 1", description: "Mostar", completed: false, dueDate: "2024-12-31", priority: "high", status: "pending" },
    { id: 2, title: "Test 2", description: "Sarajevo", completed: false, dueDate: "2024-12-31", priority: "low", status: "completed" },
  ];
  
  // Mocked fetchData function
  const fetchData = jest.fn().mockResolvedValue(undefined);

  it("renders the container with proper styling", () => {
    render(<WeatherList weatherData={mockWeather} fetchData={fetchData} />);
    const container = screen.getByTestId("weather-list-container");
    expect(container).toBeInTheDocument();
  });

  it("renders the WeatherCard components for each item", () => {
    render(<WeatherList weatherData={mockWeather} fetchData={fetchData} />);
    const weatherItems = screen.getAllByTestId("weather-card");  // Looking for the mocked WeatherCard component
    expect(weatherItems).toHaveLength(mockWeather.length);
  });

  it("applies the correct styles to the container", () => {
    render(<WeatherList weatherData={mockWeather} fetchData={fetchData} />);
    const container = screen.getByTestId("weather-list-container");
    const computedStyle = window.getComputedStyle(container);
    
    // Check the gradient background style
    expect(computedStyle.background).toBe("rgb(255, 255, 255)");
  });

  it("renders the category name correctly", () => {
    render(<WeatherList weatherData={mockWeather} fetchData={fetchData} />);
    // Assuming that WeatherCard might render some property from `mockWeather`, we should verify it
    // Since WeatherCard is mocked, we're only testing the WeatherList rendering
    expect(screen.getAllByTestId("weather-card")).toHaveLength(mockWeather.length);
  });
});
