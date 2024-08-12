import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
});

// Styled Components
const FormContainer = styled(Paper)({
  padding: '40px 20px',
  borderRadius: '10px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
});

const ContactInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
});

const IconWrapper = styled(Box)({
  marginRight: '10px',
  color: '#1976d2',
});

const SocialMediaButton = styled(IconButton)({
  marginRight: '10px',
  color: '#1976d2',
});

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
};

const ContactUs = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // Here you can handle form submission (e.g., send data to a server)
    console.log('Form Data:', data);
    setIsSubmitted(true);
    reset();
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          We’d love to hear from you! Fill out the form below to get in touch with us.
        </Typography>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <FormContainer component={motion.div} whileHover={{ scale: 1.02 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.name}
                      helperText={errors.name ? errors.name.message : ''}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ''}
                    />
                  )}
                />
                <Controller
                  name="message"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Message"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      error={!!errors.message}
                      helperText={errors.message ? errors.message.message : ''}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Send Message
                </Button>
                {isSubmitted && (
                  <Typography
                    variant="body1"
                    color="success.main"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    Thank you for your message! We will get back to you soon.
                  </Typography>
                )}
              </form>
            </FormContainer>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: '10px' }}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
            >
              <Typography variant="h5" gutterBottom>
                Get In Touch
              </Typography>
              <ContactInfo>
                <IconWrapper>
                  <EmailIcon />
                </IconWrapper>
                <Typography variant="body1">info@example.com</Typography>
              </ContactInfo>
              <ContactInfo>
                <IconWrapper>
                  <PhoneIcon />
                </IconWrapper>
                <Typography variant="body1">+1 (234) 567-8901</Typography>
              </ContactInfo>
              <ContactInfo>
                <IconWrapper>
                  <LocationOnIcon />
                </IconWrapper>
                <Typography variant="body1">
                  1234 Example St, City, Country
                </Typography>
              </ContactInfo>
              <Box mt={3}>
                <SocialMediaButton
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                >
                  <FacebookIcon />
                </SocialMediaButton>
                <SocialMediaButton
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                >
                  <TwitterIcon />
                </SocialMediaButton>
                <SocialMediaButton
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                >
                  <LinkedInIcon />
                </SocialMediaButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default ContactUs;
