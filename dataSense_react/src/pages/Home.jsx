import React from "react";
import {
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsightsIcon from "@mui/icons-material/Insights";
import CodeIcon from "@mui/icons-material/Code";
import CompareIcon from "@mui/icons-material/Compare";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bg_image from "../assets/images/bg_image_1.jpg";
import SummarizeIcon from "@mui/icons-material/Summarize";
import RecommendIcon from "@mui/icons-material/Recommend";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    h2: {
      fontSize: "2.5rem", // Responsive font size for h2
      "@media (min-width:600px)": {
        fontSize: "3.5rem",
      },
    },
    h5: {
      fontSize: "1.2rem", // Responsive font size for h5
      "@media (min-width:600px)": {
        fontSize: "1.5rem",
      },
    },
  },
});

// Feature data
const features = [
  {
    title: "Data Profiling",
    description: "Understand your data with detailed profiling.",
    icon: <InsightsIcon fontSize="large" color="primary" />,
  },
  {
    title: "Data Summarization",
    description: "Generate key insights from dataset.",
    icon: <SummarizeIcon fontSize="large" color="primary" />,
  },
  {
    title: "DDL Generation",
    description: "Automatically generate DDL scripts for various databases.",
    icon: <CodeIcon fontSize="large" color="secondary" />,
  },
  {
    title: "DDL Comparison",
    description: "Compare DDL queries and enhance your database performance.",
    icon: <CompareIcon fontSize="large" color="success" />,
  },
  {
    title: "DDL Recommendation",
    description: "Provides actionable schema improvement suggestions.",
    icon: <RecommendIcon fontSize="large" color="success" />,
  },
];

// Styled components
const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "20px",
  background: "#f5f4f2",
  borderRadius: "10px",
  transition: "transform 0.2s ease-in-out",
  // "&:hover": {
  //   transform: "scale(1.05)",
  // },
  // Ensure cards have consistent sizing and spacing on smaller screens
  [theme.breakpoints.down("sm")]: {
    margin: "10px 0",
    padding: "10px",
  },
}));

// Carousel settings
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 400,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        arrows: false, // Optionally hide arrows for mobile
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],

  adaptiveHeight: true, // Adjusts carousel height based on slide content
};

function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Header */}
      <AppBar position="static" color="primary" sx={{ boxShadow: "none" }}>
        <Toolbar sx={{ color: "#ff5500" }}>
          <InsertChartIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Data Insights
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 10, sm: 15 }, // Adjust padding for different screen sizes
          textAlign: "center",
          backgroundImage: `url(${bg_image})`, // Example background image
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Data Insights
          </Typography>
          <Typography variant="h5" component="h2" paragraph>
            Discover and analyze your data effortlessly with our comprehensive
            tools.
          </Typography>
        </Container>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          {/* Features Section */}
          <Container maxWidth="lg" sx={{ my: 5 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Our Features
            </Typography>
            <Slider {...carouselSettings}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ px: 1 }}>
                  {/* Add padding to prevent overflow on small screens */}
                  <FeatureCard>
                    <Box my={2}>{feature.icon}</Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </Box>
              ))}
            </Slider>
          </Container>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Home;
