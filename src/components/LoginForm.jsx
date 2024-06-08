import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';
import axios from 'axios';
import './PriceComparisonForm.css'; // Ensure this CSS file is imported


//accepts user input and sends to backend for validation
const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // makes request to the backend to log in - stores JWT in session storage
    try {
      const response = await axios.post('https://backend-service-4snlfkepaq-uc.a.run.app/api/login', { username, password });
      if (response.status === 200) {
        const token = response.data.token;
        sessionStorage.setItem('token', token);
        console.log('Token stored:', token);
        handleLogin(); // Call handleLogin to set the logged-in state

        // Clear all form fields
        setUsername('');
        setPassword('');
        setError('');

        // upon successful login  Navigate to the Price Comparison page
        navigate('/compare');
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="dark-textfield"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dark-textfield"
        />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </form>
    </Container>
  );
};

export default LoginForm;
