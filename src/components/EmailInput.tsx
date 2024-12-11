import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";

const EmailInput: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (email) {
      navigate(`/tasks?email=${email}`);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="center">
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        fullWidth
        required
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!email}
      >
        View Tasks
      </Button>
    </Box>
  );
};

export default EmailInput;
