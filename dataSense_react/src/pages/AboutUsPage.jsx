import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import MissionIcon from "@mui/icons-material/Flag";
import VisionIcon from "@mui/icons-material/Visibility";
import bg_image from "../assets/images/bg_image_1.jpg";

// Styled Components
const HeroContainer = styled(Box)({
  backgroundImage: `url(${bg_image})`, // Replace with an actual image URL
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "400px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "white",
  padding: "0 20px",
  boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.3)", // Adds a subtle overlay to enhance text readability
});

const Section = styled(Container)({
  padding: "60px 0",
});

const InteractiveCard = styled(motion(Card))({
  maxWidth: 345,
  margin: "20px auto",
  cursor: "pointer",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.2)",
  },
});

const AboutUs = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroContainer>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            About Us
          </Typography>
          <Typography variant="h5">
            Welcome to Bigtapp Analytics, where data meets innovation to drive
            better business decisions and operational excellence.
          </Typography>
        </Container>
      </HeroContainer>

      {/* Mission Section */}
      <Section maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Our Mission
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Typography variant="body1" paragraph>
                At Bigtapp Analytics, our mission is to provide you with a
                seamless and intuitive platform that leverages the power of
                artificial intelligence and machine learning. We aim to assist
                you in managing your data efficiently, generating valuable
                insights, and making informed decisions that drive business
                growth.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <MissionIcon sx={{ fontSize: 100, color: "#1976d2" }} />
            </motion.div>
          </Grid>
        </Grid>
      </Section>

      {/* Vision Section */}
      <Section maxWidth="lg" sx={{ bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Vision
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <VisionIcon sx={{ fontSize: 100, color: "#1976d2" }} />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Typography variant="body1" paragraph>
                We envision a world where data is not just an asset but a
                catalyst for transformation. Our journey began with a simple yet
                powerful idea: to empower organizations with the tools and
                knowledge they need to harness the full potential of their data.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
      </Section>

      {/* Team Section */}
      <Section maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Meet Our Team
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              name: "John Doe",
              role: "CEO",
              image: "https://via.placeholder.com/150",
            },
            {
              name: "Jane Smith",
              role: "CTO",
              image: "https://via.placeholder.com/150",
            },
            {
              name: "Mike Johnson",
              role: "COO",
              image: "https://via.placeholder.com/150",
            },
          ].map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <InteractiveCard
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={member.image}
                  alt={member.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </InteractiveCard>
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Call to Action Section */}
      <Section maxWidth="lg" sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Join Us on Our Journey
        </Typography>
        <Typography variant="body1" paragraph>
          We are always looking for passionate and talented individuals to join
          our team. Explore our career opportunities and become a part of our
          exciting journey.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          View Careers
        </Button>
      </Section>
    </>
  );
};

export default AboutUs;
