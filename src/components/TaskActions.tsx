import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { Task } from "../types/Task";
import { deleteTask } from "../api/taskApi";

interface TaskActionsProps {
  task: Task;
  onEdit: () => void;
  onDeleteSuccess: () => void;
}

const TaskActions: React.FC<TaskActionsProps> = ({
  task,
  onEdit,
  onDeleteSuccess,
}) => {
  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onDeleteSuccess();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <ButtonGroup variant="contained" size="small">
      <Button color="primary" onClick={onEdit}>
        Edit
      </Button>
      <Button color="secondary" onClick={handleDelete}>
        Delete
      </Button>
    </ButtonGroup>
  );
};

export default TaskActions;
