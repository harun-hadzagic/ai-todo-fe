import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import TaskList from './TaskList';
import { Priority, Status } from '../types/Task';

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

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: '2024-03-20',
      priority: Priority.HIGH,
      status: Status.ONGOING,
      category: {
        id: 1,
        name: 'Test Category',
      },
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      dueDate: '2024-03-21',
      priority: Priority.NORMAL,
      status: Status.COMPLETED,
      category: {
        id: 1,
        name: 'Test Category',
      },
    },
  ];

  it('renders category name and tasks correctly', () => {
    render(
      <TaskList tasks={mockTasks} categoryName="Test Category" />,
      { wrapper: createWrapper() }
    );

    // Check if category name is rendered
    expect(screen.getByText('Test Category')).toBeInTheDocument();

    // Check if all tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('renders empty task list correctly', () => {
    render(
      <TaskList tasks={[]} categoryName="Empty Category" />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Empty Category')).toBeInTheDocument();
  });

  it('renders tasks with correct priority and status', () => {
    render(
      <TaskList tasks={mockTasks} categoryName="Test Category" />,
      { wrapper: createWrapper() }
    );

    // Check if priority chips are rendered correctly
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Normal Priority')).toBeInTheDocument();

    // Check if status chips are rendered correctly
    expect(screen.getByText('Ongoing')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
