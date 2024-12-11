import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { createTask, updateTask } from "../api/taskApi";
import {
  getAllCategories,
  getCategorySuggestion,
  createCategory,
} from "../api/categoryApi";
import { Task, Priority, Status } from "../types/Task";
import { useLocation } from "react-router-dom";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  existingTask?: Task;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmitSuccess,
  existingTask,
  categories,
}) => {
  // Extract date in "YYYY-MM-DD" format if existingTask has dueDate
  const formatDueDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const [title, setTitle] = useState(existingTask?.title || "");
  const [description, setDescription] = useState(
    existingTask?.description || ""
  );
  const [dueDate, setDueDate] = useState(formatDueDate(existingTask?.dueDate));
  const [priority, setPriority] = useState<Priority>(
    existingTask?.priority || Priority.NORMAL
  );
  const [status, setStatus] = useState<Status>(
    existingTask?.status || Status.ONGOING
  );
  const [categoryId, setCategoryId] = useState<number | "">(
    existingTask?.category.id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [categoriesState, setCategories] = useState<Category[]>(categories);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSuggestCategory = async () => {
    if (!description) {
      setResponseMessage(
        "Please provide a task description to suggest a category."
      );
      setShowResponseModal(true);
      return;
    }

    setIsSuggestingCategory(true);
    try {
      const suggestion = await getCategorySuggestion(description);
      setSuggestedCategory(suggestion);
      setShowConfirmDialog(true);
    } catch (error) {
      console.error("Failed to suggest category:", error);
      setResponseMessage("Failed to suggest category. Please try again.");
      setShowResponseModal(true);
    } finally {
      setIsSuggestingCategory(false);
    }
  };

  const handleConfirmCategory = async () => {
    if (suggestedCategory) {
      const existingCategory = categoriesState.find(
        (cat) => cat.name.toLowerCase() === suggestedCategory.toLowerCase()
      );

      if (existingCategory) {
        // If category already exists, select it in the form
        setCategoryId(existingCategory.id);
      } else {
        // If category doesn't exist, create it
        try {
          const newCategory = await createCategory(suggestedCategory);
          // Update local state
          const updatedCategories = [...categoriesState, newCategory];
          setCategories(updatedCategories);
          // Set the category ID to the newly created category's ID
          setCategoryId(newCategory.id);
        } catch (error) {
          console.error("Failed to create category:", error);
          setResponseMessage(
            "Failed to create new category. Please try again."
          );
          setShowResponseModal(true);
        }
      }
    }
    setShowConfirmDialog(false);
  };

  const handleSubmit = async () => {
    if (categoryId === "") {
      setResponseMessage("Please select a category.");
      setShowResponseModal(true);
      return;
    }

    if (!email) {
      setResponseMessage("User email is missing.");
      setShowResponseModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      if (existingTask) {
        await updateTask(existingTask.id, {
          ...existingTask,
          title,
          description,
          dueDate,
          priority,
          status,
          category: { id: categoryId, name: "" },
        });
        setResponseMessage("Task updated successfully!");
      } else {
        await createTask(
          {
            id: 0,
            title,
            description,
            dueDate,
            priority,
            status,
            category: { id: categoryId, name: "" },
          },
          email
        );
        setResponseMessage("Task created successfully!");
      }
      setShowResponseModal(true);
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error(
        existingTask ? "Failed to update task" : "Failed to create task",
        error
      );
      setResponseMessage(
        existingTask
          ? "Failed to update task. Please try again."
          : "Failed to create task. Please try again."
      );
      setShowResponseModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {existingTask ? "Edit Task" : "Create New Task"}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              required
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSuggestCategory}
              disabled={isSuggestingCategory}
            >
              {isSuggestingCategory ? (
                <CircularProgress size={24} />
              ) : (
                "Suggest Category"
              )}
            </Button>
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl required fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <MenuItem value={Priority.HIGH}>High</MenuItem>
                <MenuItem value={Priority.NORMAL}>Normal</MenuItem>
              </Select>
            </FormControl>
            <FormControl required fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <MenuItem value={Status.COMPLETED}>Completed</MenuItem>
                <MenuItem value={Status.ONGOING}>Ongoing</MenuItem>
              </Select>
            </FormControl>
            <FormControl required fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {categoriesState.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : existingTask ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showResponseModal}
        onClose={() => setShowResponseModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="body1">{responseMessage}</Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowResponseModal(false)}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Use Suggested Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The suggested category is "{suggestedCategory}". Would you like to
            use it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="secondary">
            No
          </Button>
          <Button onClick={handleConfirmCategory} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskForm;
