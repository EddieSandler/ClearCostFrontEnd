import React from 'react';
import { Container, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import './Auth.css';

//toggles between the login form and registration form 
const Auth = ({ isRegister, handleLogin, showRegisterForm, showLoginForm }) => {
  const navigate = useNavigate();

  const handleLoginWithNavigation = () => {
    handleLogin();
    navigate('/compare');
  };

  return (
    <div className="authBackground">
      <Container className="authContainer">
        {isRegister ? (
          <RegistrationForm handleLogin={handleLoginWithNavigation} />
        ) : (
          <LoginForm handleLogin={handleLoginWithNavigation} />
        )}
        <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link component="button" onClick={isRegister ? showLoginForm : showRegisterForm} style={{ cursor: 'pointer' }}>
            {isRegister ? 'Login' : 'Register'}
          </Link>
        </Typography>
      </Container>
    </div>
  );
};

export default Auth;
