import React from "react";
import { mount } from "cypress/react18";
import TaskItem from "../../components/TaskItem";
import { Task, Priority, Status } from "../../types/Task";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

describe("TaskItem Component", () => {
  const mockTask: Task = {
    id: 1,
    title: "Sample Task",
    description: "This is a sample task description.",
    dueDate: "2024-12-31",
    priority: Priority.HIGH,
    status: Status.ONGOING,
    category: { id: 1, name: "Work" },
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient();

    // Intercept API calls
    cy.intercept("DELETE", "https://ai-todo-fp84.onrender.com/api/tasks/*", {
      statusCode: 200,
    }).as("deleteTask");
    cy.intercept("GET", "https://ai-todo-fp84.onrender.com/api/tasks/email/*", {
      statusCode: 200,
      body: [mockTask],
    }).as("getTasks");

    // Mount the component with QueryClientProvider and MemoryRouter
    mount(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TaskItem task={mockTask} email="test@example.com" />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  it("renders the task details correctly", () => {
    // Validate task details
    cy.contains("Sample Task").should("be.visible");
    cy.contains("Due Date: 2024-12-31").should("be.visible");
    cy.contains("This is a sample task description.").should("be.visible");
    cy.contains("High Priority").should("be.visible");
    cy.contains("Ongoing").should("be.visible");
  });

  it("opens the edit form when clicking the edit button", () => {
    // Click the edit button
    cy.get('button[aria-label="edit"]').click();

    // Verify that the edit form appears
    cy.contains("Edit Task").should("be.visible"); // Assuming TaskForm renders with "Edit Task"
    cy.contains("Sample Task").should("be.visible"); // Verify category is pre-filled
  });

  it("deletes the task when clicking the delete button", () => {
    cy.contains("Sample Task").should("be.visible");
    cy.get('button[aria-label="delete"]').should("be.visible").click();

    // Wait for the delete request and then check
    cy.wait("@deleteTask").then(() => {
      cy.contains("Sample Task").should("not.exist");
    });
  });
});
