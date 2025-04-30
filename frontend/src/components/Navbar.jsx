import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Container,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const userType = user?.userType;
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getInitials = () => {
    return user?.name?.charAt(0)?.toUpperCase() ?? <AccountCircleIcon />;
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        background:
          "linear-gradient(135deg, #A6D8FF 0%, #6B9FBF 50%, #3F7CAD 100%)",
        boxShadow: "0 4px 20px rgba(63, 124, 173, 0.15)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            padding: "10px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo and Name (Left) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.02)",
                transition: "transform 0.3s ease",
              },
            }}
            onClick={() => navigate("/")}
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="./logo.png"
                alt="Logo"
                style={{
                  width: 38,
                  height: 38,
                  marginRight: 12,
                  filter: "drop-shadow(0px 3px 6px rgba(63, 124, 173, 0.4))",
                }}
              />
            </motion.div>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                color: "#fff",
                textShadow: "0px 2px 4px rgba(255, 255, 255, 0.3)",
                letterSpacing: "1px",
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              DU Tutors
            </Typography>
          </Box>

          {/* Navigation Links (Middle) */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flex: 1,
              mx: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                borderRadius: "30px",
                padding: "5px",
                boxShadow: "0 2px 10px rgba(63, 124, 173, 0.15)",
                backdropFilter: "blur(5px)",
              }}
            >
              <Button
                color="inherit"
                component={Link}
                to="/posts"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: "25px",
                  padding: "8px 18px",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontFamily: '"Poppins", sans-serif',
                  letterSpacing: "0.8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 3px 8px rgba(63, 124, 173, 0.2)",
                  },
                }}
              >
                POSTS
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/applications"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: "25px",
                  padding: "8px 18px",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontFamily: '"Poppins", sans-serif',
                  letterSpacing: "0.8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 3px 8px rgba(63, 124, 173, 0.2)",
                  },
                }}
              >
                APPLICATIONS
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/chats"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: "25px",
                  padding: "8px 18px",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontFamily: '"Poppins", sans-serif',
                  letterSpacing: "0.8px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 3px 8px rgba(63, 124, 173, 0.2)",
                  },
                }}
              >
                CHATS
              </Button>
              </Box>
          </Box>

          {/* User Profile or Login (Right) */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.35)",
                      color: "#fff",
                      transition: "all 0.3s ease",
                      padding: "8px",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        boxShadow: "0 4px 12px rgba(63, 124, 173, 0.2)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35,
                        backgroundColor: "#4C8BBF",
                        color: "white",
                        boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.6)",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      {getInitials()}
                    </Avatar>
                  </IconButton>
                </motion.div>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      elevation: 5,
                      sx: {
                        overflow: "visible",
                        filter:
                          "drop-shadow(0px 4px 15px rgba(63, 124, 173, 0.25))",
                        mt: 1.5,
                        width: 250,
                        borderRadius: "16px",
                        border: "1px solid rgba(63, 124, 173, 0.2)",
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                          borderTop: "1px solid rgba(63, 124, 173, 0.2)",
                          borderLeft: "1px solid rgba(63, 124, 173, 0.2)",
                        },
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      pb: 1.5,
                      pt: 2,
                      background:
                        "linear-gradient(135deg, rgba(221, 241, 255, 0.4), rgba(179, 214, 242, 0.2))",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: "#2B5A83",
                        fontFamily: '"Poppins", sans-serif',
                      }}
                    >
                      {user?.name || "User"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4C8BBF",
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: "0.85rem",
                      }}
                    >
                      {user?.email || "user@example.com"}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleMenuClose();
                    }}
                    sx={{
                      py: 1.8,
                      mx: 1,
                      borderRadius: "10px",
                      fontFamily: '"Poppins", sans-serif',
                      "&:hover": {
                        backgroundColor: "rgba(221, 241, 255, 0.5)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon
                        fontSize="small"
                        style={{ color: "#4C8BBF" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile"
                      sx={{
                        '& .MuiTypography-root': {
                          fontFamily: '"Poppins", sans-serif',
                          fontWeight: 600,
                          color: "#2B5A83",
                        }
                      }}
                    />
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />

                  <MenuItem
                    onClick={() => {
                      logout();
                      handleMenuClose();
                    }}
                    sx={{
                      py: 1.8,
                      mx: 1,
                      mb: 0.5,
                      borderRadius: "10px",
                      fontFamily: '"Poppins", sans-serif',
                      "&:hover": {
                        backgroundColor: "rgba(211, 47, 47, 0.08)",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon
                        fontSize="small"
                        style={{ color: "#d32f2f" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      sx={{ 
                        color: "#d32f2f",
                        '& .MuiTypography-root': {
                          fontFamily: '"Poppins", sans-serif',
                          fontWeight: 600,
                        }
                      }}
                    />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    mr: 2,
                    color: "#fff",
                    fontWeight: 500,
                    fontFamily: '"Poppins", sans-serif',
                    "&:hover": {
                      color: "#1A3E59",
                    },
                  }}
                >
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    component={Link}
                    to="/login"
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      backgroundColor: "#4C8BBF",
                      color: "white",
                      borderRadius: "28px",
                      padding: "8px 24px",
                      boxShadow: "0 6px 15px rgba(63, 124, 173, 0.25)",
                      fontSize: "0.95rem",
                      fontFamily: '"Poppins", sans-serif',
                      letterSpacing: "0.5px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3A79AD",
                        boxShadow: "0 8px 20px rgba(63, 124, 173, 0.3)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Log In
                  </Button>
                </motion.div>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;