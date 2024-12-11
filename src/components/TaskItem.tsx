import React, { useState } from "react";
import { Task, Priority, Status } from "../types/Task";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { deleteTask } from "../api/taskApi";
import TaskForm from "./TaskForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteTaskMutation, isLoading: isDeleting } = useMutation(
    deleteTask,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
      },
      onError: (error) => {
        console.error("Failed to delete task:", error);
      },
    }
  );

  const handleDelete = () => {
    deleteTaskMutation(task.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const formatDueDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <>
      <Card
        variant="elevation"
        sx={{
          marginBottom: 3,
          padding: { xs: 2, sm: 3 },
          boxShadow: 4,
          borderRadius: 3,
          background: "linear-gradient(to right, #e0f7fa, #ffffff)",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 6,
          },
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: "#00796b",
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
            }}
          >
            {task.title}
          </Typography>

          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
            <EventIcon color="primary" />
            <Typography
              color="text.secondary"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              Due Date: {formatDueDate(task.dueDate)}
            </Typography>
          </Stack>

          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              color: "#4f4f4f",
            }}
          >
            {task.description}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
            <Chip
              icon={<PriorityHighIcon />}
              label={
                task.priority === Priority.HIGH
                  ? "High Priority"
                  : "Normal Priority"
              }
              sx={{
                color: "#ffffff",
                backgroundColor:
                  task.priority === Priority.HIGH ? "#d32f2f" : "#1976d2",
                fontWeight: "bold",
              }}
            />
            <Chip
              icon={
                task.status === Status.COMPLETED ? (
                  <CheckCircleIcon />
                ) : (
                  <HourglassEmptyIcon />
                )
              }
              label={task.status}
              sx={{
                color: "#ffffff",
                backgroundColor:
                  task.status === Status.COMPLETED ? "#388e3c" : "#fbc02d",
                fontWeight: "bold",
              }}
            />
          </Stack>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <IconButton
              aria-label="edit"
              color="primary"
              onClick={handleEdit}
              sx={{
                backgroundColor: "#e0f7fa",
                "&:hover": { backgroundColor: "#b2ebf2" },
                transition: "all 0.3s ease-in-out",
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={handleDelete}
              disabled={isDeleting}
              sx={{
                backgroundColor: "#ffcdd2",
                "&:hover": { backgroundColor: "#ef9a9a" },
                transition: "all 0.3s ease-in-out",
              }}
            >
              {isDeleting ? <CircularProgress size={24} /> : <DeleteIcon />}
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {isEditing && (
        <TaskForm
          open={isEditing}
          onClose={() => setIsEditing(false)}
          onSubmitSuccess={() => {
            setIsEditing(false);
            queryClient.invalidateQueries(["tasks"]);
          }}
          existingTask={{
            ...task,
            dueDate: formatDueDate(task.dueDate),
          }}
          categories={[task.category]}
        />
      )}
    </>
  );
};

export default TaskItem;
