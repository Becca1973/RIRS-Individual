import React, { useState } from "react";
import { login } from "../api/userApi";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Ločena funkcija za validacijo gesla
  const validatePassword = (password) => {
    if (!password || password.trim() === "") {
      return "Password is required";
    }
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 2) {
      return "Password is too weak. Try a stronger one.";
    }
    return null;
  };

  const validate = () => {
    const errors = {};

    // Validacija emaila
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Uporaba ločene validacije za geslo
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const user = {
          email: formData.email,
          password: formData.password, // Geslo posredujemo varno
        };

        const response = await login(user);

        if (response) {
          localStorage.setItem("token", response.token); // Shranjevanje tokena
          localStorage.setItem("userId", response.userId);
          setSuccessMessage("Login successful!");
          setOpenSnackbar(true);
          setFormData({
            email: "",
            password: "",
          });
          navigate("/");
        } else {
          setSuccessMessage("Login failed. Try again.");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error during login:", error);
        setSuccessMessage("An error occurred. Please try again.");
        setOpenSnackbar(true);
      }
    } else {
      setSuccessMessage("");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "56px",
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage.includes("successful") ? "success" : "error"}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;
