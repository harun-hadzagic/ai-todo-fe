import React from "react";
import { Task } from "../types/Task";
import TaskItem from "./TaskItem";
import { Box, Typography, Divider, Paper } from "@mui/material";

interface TaskListProps {
  tasks: Task[];
  categoryName: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, categoryName }) => {
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
          <TaskItem key={task.id} task={task} />
        ))}
      </Box>
    </Paper>
  );
};

export default TaskList;
