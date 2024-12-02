import React, { useState } from "react";
import { submitLeaveRequest } from "../api/requestApi";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const RequestForm = () => {
  const [dopusti, setDopusti] = useState([
    { startDate: "", endDate: "", razlog: "", tip: "" },
  ]);
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [openSnackbar, setOpenSnackbar] = useState(false); // Open snackbar state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleDopustChange = (index, e) => {
    const { name, value } = e.target;
    const newDopusti = [...dopusti];
    newDopusti[index][name] = value;
    setDopusti(newDopusti);
  };

  const addDopust = () => {
    setDopusti((prevDopusti) => [
      ...prevDopusti,
      { startDate: "", endDate: "", razlog: "", tip: "" },
    ]);
  };

  const deleteDopust = (index) => {
    const newDopusti = dopusti.filter((_, i) => i !== index);
    setDopusti(newDopusti);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation to ensure start date is before end date
    const invalidDates = dopusti.some(
      (dopust) => new Date(dopust.startDate) > new Date(dopust.endDate)
    );

    if (invalidDates) {
      setErrorMessage("Start date must be before the end date");
      return;
    } else {
      setErrorMessage(""); // Clear error if dates are valid
    }

    try {
      const response = await submitLeaveRequest(dopusti);

      if (response.status === 201) {
        setSuccessMessage("Request submitted successfully!"); // Set success message
        setOpenSnackbar(true); // Open snackbar
        setDopusti([{ startDate: "", endDate: "", razlog: "", tip: "" }]); // Reset the form
      }
    } catch (error) {
      setSuccessMessage("Failed to submit request"); // Set error message
      setOpenSnackbar(true); // Open snackbar
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close snackbar
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginTop: "40px",
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom>
        Leave Request Form
      </Typography>
      <form onSubmit={handleSubmit}>
        {dopusti.map((dopust, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              border: "1px solid #ddd",
              p: 2,
              borderRadius: "8px",
              position: "relative",
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                color: "red",
                padding: "5px",
                fontSize: "16px",
              }}
              onClick={() => deleteDopust(index)}
              aria-label={`Delete leave ${index + 1}`}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>

            <TextField
              label="Reason"
              name="razlog"
              fullWidth
              margin="normal"
              value={dopust.razlog}
              onChange={(e) => handleDopustChange(index, e)}
            />
            <TextField
              select
              label="Leave Type"
              name="tip"
              fullWidth
              margin="normal"
              value={dopust.tip}
              onChange={(e) => handleDopustChange(index, e)}
              required
            >
              <MenuItem value="1">Vacation Leave</MenuItem>
              <MenuItem value="2">Maternity Leave</MenuItem>
              <MenuItem value="3">Paternity Leave</MenuItem>
              <MenuItem value="4">Sick Leave</MenuItem>
              <MenuItem value="5">Personal Leave</MenuItem>
            </TextField>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              fullWidth
              margin="normal"
              value={dopust.startDate}
              onChange={(e) => handleDopustChange(index, e)}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              fullWidth
              margin="normal"
              value={dopust.endDate}
              onChange={(e) => handleDopustChange(index, e)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        ))}

        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={addDopust}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Another Leave
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit Request
        </Button>
      </form>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
        >
          {successMessage || "Failed to submit request"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestForm;
