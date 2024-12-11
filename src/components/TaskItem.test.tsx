import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import TaskItem from './TaskItem';
import { Priority, Status, Task } from '../types/Task';

// Mock the API calls
jest.mock('../api/taskApi', () => ({
  deleteTask: jest.fn(),
}));

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('TaskItem Component', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-03-20',
    priority: Priority.HIGH,
    status: Status.ONGOING,
    category: {
      id: 1,
      name: 'Test Category',
    },
  };

  it('renders task details correctly', () => {
    render(<TaskItem task={mockTask} />, { wrapper: createWrapper() });

    // Check if main task details are rendered
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Due Date: 2024-03-20')).toBeInTheDocument();
    
    // Check if priority and status chips are rendered
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('opens edit form when edit button is clicked', () => {
    render(<TaskItem task={mockTask} />, { wrapper: createWrapper() });

    const editButton = screen.getByLabelText('edit');
    fireEvent.click(editButton);

    // Check if the edit form is displayed
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('shows delete confirmation when delete button is clicked', async () => {
    render(<TaskItem task={mockTask} />, { wrapper: createWrapper() });

    const deleteButton = screen.getByLabelText('delete');
    fireEvent.click(deleteButton);

    // Wait for loading spinner to appear
    await waitFor(() => {
      const loadingSpinner = screen.getByRole('progressbar');
      expect(loadingSpinner).toBeInTheDocument();
    });
  });

  it('applies hover styles on card', () => {
    render(<TaskItem task={mockTask} />, { wrapper: createWrapper() });
    
    const card = screen.getByRole('article');
    
    // Check initial styles
    expect(card).toHaveStyle({
      transform: 'scale(1)',
    });

    // Simulate hover
    fireEvent.mouseEnter(card);

    // Check hover styles
    expect(card).toHaveStyle({
      transform: 'scale(1.02)',
    });
  });
});
