import React from "react";
import TaskItem from "./TaskItem";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { useQuery, useQueryClient } from "react-query";
import { getTasksByEmail } from "../api/taskApi";
import LoadingSpinner from "./LoadingSpinner";

interface TaskListProps {
  categoryName: string;
  email: string;
}

const TaskList: React.FC<TaskListProps> = ({ categoryName, email }) => {
  const queryClient = useQueryClient();
  const { data: tasks, isLoading } = useQuery(
    ["tasks", email],
    () => getTasksByEmail(email),
    {
      refetchOnWindowFocus: false,
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks", email]);
      },
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!tasks) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: { xs: 2, sm: 4 },
        marginBottom: 4,
        borderRadius: 3,
        background: "linear-gradient(to right, #ffffff, #e3f2fd)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1976d2",
          marginBottom: 3,
          fontSize: { xs: "1.6rem", sm: "2rem" },
        }}
      >
        {categoryName}
      </Typography>
      <Divider sx={{ marginBottom: 3 }} />
      <Box>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} email={email} />
        ))}
      </Box>
    </Paper>
  );
};

export default TaskList;
