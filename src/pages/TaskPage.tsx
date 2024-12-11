import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getTasksByEmail } from "../api/taskApi";
import { Task } from "../types/Task";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { useLocation } from "react-router-dom";
import { Button, Box, Container, Typography, Paper } from "@mui/material";
import LoadingSpinner from "../components/LoadingSpinner";

const TaskPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const { data, isLoading, error, refetch } = useQuery(
    ["tasks", email],
    () => getTasksByEmail(email),
    {
      enabled: !!email,
      onSuccess: (data) => {
        const uniqueCategories = Array.from(
          new Set(data.map((task) => task.category.id))
        )
          .map((id) => {
            const task = data.find((t) => t.category.id === id);
            return task?.category;
          })
          .filter(Boolean);

        queryClient.setQueryData("categories", uniqueCategories);
      },
    }
  );

  const tasks = data || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
          Error loading data. Please try again later.
        </Typography>
      </Container>
    );
  }

  const tasksByCategory = tasks.reduce((acc: Record<string, Task[]>, task) => {
    if (!acc[task.category.name]) {
      acc[task.category.name] = [];
    }
    acc[task.category.name].push(task);
    return acc;
  }, {});

  return (
    <Container
      maxWidth="md"
      sx={{
        fontFamily: "'Poppins', sans-serif",
        mt: 4,
        paddingX: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: 3,
          background: "linear-gradient(to right, #ffffff, #f3f4f6)",
          boxShadow: 4,
          mb: 4,
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "start", sm: "center" }}
          mb={4}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mb: { xs: 2, sm: 0 },
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
          >
            Tasks for {email}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsCreating(!isCreating)}
            sx={{
              textTransform: "none",
              backgroundColor: "#00796b",
              "&:hover": {
                backgroundColor: "#004d40",
              },
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          >
            {isCreating ? "Cancel" : "Create New Task"}
          </Button>
        </Box>
        {isCreating && (
          <TaskForm
            open={isCreating}
            onClose={() => setIsCreating(false)}
            onSubmitSuccess={() => {
              setIsCreating(false);
              refetch();
            }}
            categories={queryClient.getQueryData("categories") || []}
          />
        )}
      </Paper>
      {Object.entries(tasksByCategory).map(([categoryName, tasks]) => (
        <TaskList
          key={categoryName}
          tasks={tasks}
          categoryName={categoryName}
        />
      ))}
    </Container>
  );
};

export default TaskPage;
