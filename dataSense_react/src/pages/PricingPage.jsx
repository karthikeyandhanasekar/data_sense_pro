import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';

// Dummy Pricing Data
const pricingData = [
  {
    title: 'Individual Plan',
    price: '$9.99/month',
    features: [
      'Access to basic features',
      'Limited support',
      'Personal use only',
    ],
  },
  {
    title: 'Organization Plan',
    price: '$49.99/month',
    features: [
      'Access to all features',
      'Up to 10 members',
      'Priority support',
    ],
  },
  {
    title: 'Enterprise Plan',
    price: '$199.99/month',
    features: [
      'Unlimited access to all features',
      'Unlimited members',
      'Dedicated support',
      'Custom solutions',
    ],
  },
];

// Styled Components
const PricingCard = styled(motion(Card))({
  margin: '20px auto',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
});

// Ensure all cards have equal height
const PricingCardContent = styled(CardContent)({
  flexGrow: 1,
});

const PricingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Our Pricing Plans
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        Choose a plan that fits your needs. We offer flexible pricing options for individuals, organizations, and enterprises.
      </Typography>
      <Grid container spacing={4} alignItems="stretch">
        {pricingData.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <PricingCard
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <PricingCardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="h4" component="div" color="primary" gutterBottom>
                  {plan.price}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {plan.features.map((feature, idx) => (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    key={idx}
                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  >
                    <CheckIcon sx={{ mr: 1, color: '#1976d2' }} />
                    {feature}
                  </Typography>
                ))}
              </PricingCardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ m: 2 }}
                >
                  Choose Plan
                </Button>
              </CardActions>
            </PricingCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PricingPage;
