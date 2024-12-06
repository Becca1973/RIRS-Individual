import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import { fetchLoggedInUser } from "../../api/userApi";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const [reRender, setReRender] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedInUser = await fetchLoggedInUser();
        setUser(loggedInUser);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.pathname, reRender]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setReRender(!reRender);
    localStorage.removeItem("token");
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ marginBottom: "30px", padding: "10px" }}>
      <Toolbar>
        <Typography variant="h6" style={{ marginRight: "80px" }}>
          Leave Management
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          style={{ marginRight: "20px" }}
        >
          Home
        </Button>
        {user && (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              style={{ marginRight: "20px" }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/leaves"
              style={{ marginRight: "20px" }}
            >
              Leaves
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/request"
              style={{ marginRight: "auto" }}
            >
              Add new
            </Button>
          </>
        )}
        {loading ? (
          <CircularProgress color="inherit" style={{ marginLeft: "16px" }} />
        ) : user ? (
          <>
            <Typography
              color="inherit"
              style={{ marginLeft: "16px", cursor: "pointer" }}
              onClick={handleMenuOpen}
            >
              {user?.name}
            </Typography>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
              {user.type !== 1 && (
                <MenuItem
                  component={Link}
                  to="/admin"
                  onClick={handleMenuClose}
                >
                  Users
                </MenuItem>
              )}
              {user.type !== 1 && (
                <MenuItem
                  component={Link}
                  to="/requests"
                  onClick={handleMenuClose}
                >
                  Requests
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <div style={{ marginLeft: "auto" }}>
            <Button
              color="inherit"
              component={Link}
              to="/login"
              style={{ marginLeft: "16px" }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/register"
              style={{ marginLeft: "16px" }}
            >
              Register
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
