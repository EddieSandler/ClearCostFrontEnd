import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import './HomePage.css'; // Assuming you have the CSS file

const HomePage = () => {
  return (
    <div className="homePage">
      <Container>
        <Typography variant="h1" gutterBottom>ClearCost Health</Typography>
        <Typography variant="h2" gutterBottom>Empowering Healthcare Decision Making Through Transparent Pricing</Typography>
        <Link to="/auth" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
            Login / Register
          </Button>
        </Link>
      </Container>
    </div>
  );
};

export default HomePage;
