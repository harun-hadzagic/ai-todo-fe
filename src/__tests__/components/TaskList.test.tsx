import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "../../components/TaskList";
import { Priority, Status } from "../../types/Task";

// Mock the TaskItem component
jest.mock("../../components/TaskItem", () => () => (
  <div data-testid="task-item">Mocked TaskItem</div>
));

afterEach(() => {
  jest.clearAllMocks(); // Clear mocks
  jest.restoreAllMocks(); // Restore original implementations
});

describe("TaskList Component", () => {
  const mockTasks = [
    {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      completed: false,
      dueDate: "2024-12-31",
      priority: Priority.NORMAL,
      status: Status.ONGOING,
      category: { id: 1, name: "Default" },
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      completed: true,
      dueDate: "2024-12-31",
      priority: Priority.HIGH,
      status: Status.COMPLETED,
      category: { id: 1, name: "Default" },
    },
  ];
  const mockCategoryName = "Mocked Category";

  it("renders the container with proper styling", () => {
    render(<TaskList tasks={mockTasks} categoryName={mockCategoryName} />);
    const container = screen.getByTestId("task-list-container");
    expect(container).toBeInTheDocument();
  });

  it("renders the category name correctly", () => {
    render(<TaskList tasks={mockTasks} categoryName={mockCategoryName} />);
    expect(screen.getByText(mockCategoryName)).toBeInTheDocument();
  });

  it("renders the TaskItem components for each task", () => {
    render(<TaskList tasks={mockTasks} categoryName={mockCategoryName} />);
    const taskItems = screen.getAllByTestId("task-item");
    expect(taskItems).toHaveLength(mockTasks.length);
  });

  it("applies the correct styles to typography", () => {
    render(<TaskList tasks={mockTasks} categoryName={mockCategoryName} />);
    const title = screen.getByText(mockCategoryName);
    const computedTitleStyle = window.getComputedStyle(title);
    expect(computedTitleStyle.fontWeight).toBe("700"); // "bold"
    expect(computedTitleStyle.color).toBe("rgb(25, 118, 210)"); // Hex #1976d2 in rgb
  });

  it("renders the background gradient correctly", () => {
    render(<TaskList tasks={mockTasks} categoryName={mockCategoryName} />);
    const container = screen.getByTestId("task-list-container");
    const computedStyle = window.getComputedStyle(container);
    expect(computedStyle.backgroundImage).toContain(
      "linear-gradient(to right, rgb(255, 255, 255), rgb(227, 242, 253))"
    );
  });
});
