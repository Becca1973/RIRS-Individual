import React, { useEffect, useState } from "react";
import { getUserRequests } from "../api/requestApi";
import { deleteLeave } from "../api/requestApi";
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const data = await getUserRequests();
        console.log("Fetched user requests:", data); // Preverite podatke tukaj
        setRequests(data);
      } catch (error) {
        console.error("Error fetching user requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRequests();
  }, []);

  const leaveTypes = [
    ...new Set(
      requests.flatMap((request) =>
        request.dopusti.map((leave) => leave.tip_dopusta)
      )
    ),
  ];

  const filteredRequests = selectedType
    ? requests.filter((request) =>
        request.dopusti.some((leave) => leave.tip_dopusta === selectedType)
      )
    : requests;

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  const handleDelete = async (leaveId) => {
    if (!leaveId) {
      console.error("No leave ID provided!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this leave?")) {
      try {
        console.log("Deleting leave with ID:", leaveId);

        await deleteLeave(leaveId);

        setRequests((prevRequests) =>
          prevRequests.map((request) => ({
            ...request,
            dopusti: request.dopusti.filter((leave) => leave.id !== leaveId),
          }))
        );
      } catch (error) {
        console.error("Error deleting leave:", error);
        alert("Failed to delete the leave. Please try again.");
      }
    }
  };

  return (
    <Container
      sx={{
        bgcolor: "#fafafa",
        padding: 2,
        borderRadius: 2,
        border: "1px solid #ccc",
        boxShadow: 1,
        width: 1000,
        mt: 4,
        marginTop: "40px",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Dashboard - My Data</Typography>
        <Button variant="outlined" size="small" href="/request">
          Request Form
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel htmlFor="leave-type-select">
            Filter by Leave Type
          </InputLabel>
          <Select
            id="leave-type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            label="Filter by Leave Type"
          >
            <MenuItem value="">
              <em>All Types</em>
            </MenuItem>
            {leaveTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper} sx={{ maxHeight: 400, width: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: "#e0e0e0" }}>
              <TableCell>
                <strong>Type</strong>
              </TableCell>
              <TableCell>
                <strong>Start Date</strong>
              </TableCell>
              <TableCell>
                <strong>End Date</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request, index) =>
              request.dopusti
                .filter((leave) =>
                  selectedType ? leave.tip_dopusta === selectedType : true
                )
                .map((leave, idx) => (
                  <TableRow
                    key={`${index}-${idx}`}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell>{leave.tip_dopusta}</TableCell>
                    <TableCell>
                      {new Date(leave.zacetek).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.konec).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(leave.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Dashboard;
