import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoading } from "../components/Loading/loadingProvider";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/data_sense_logo.png";
import { clearCookies, setCookie } from "../services/cookieServices";
import RobotAnimation from "../components/Animations/RobotAnimation";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    clearCookies();
  }, []);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      // Send a POST request
      //   const response = await axios.post("https://api.example.com/login", data);
      //   console.log(response.data);
      startLoading();
      setTimeout(() => {
        stopLoading();
        setCookie({
          name: "islogined",
          value: "true",
          time: "24",
          unit: "h",
        });
        navigate("/upload");
      }, 2000);
      // Handle success response
    } catch (error) {
      console.error(error);
      // Handle error response
    } finally {
      //   stopLoading();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "10px",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                margin="normal"
                fullWidth
                // label="Email Address"
                placeholder="Enter email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                margin="normal"
                fullWidth
                // label="Password"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Box
            display="flex"
            justifyContent="space-evenly  "
            gap={2}
            flexWrap="wrap"
            sx={{
              marginBottom: "10px",
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
      <RobotAnimation />
    </Container>
  );
};

export default LoginForm;
