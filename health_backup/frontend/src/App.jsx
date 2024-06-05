import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import './components/NavBar.css';
import HomePage from './HomePage';
import PriceComparisonForm from './components/PriceComparisonForm';
import Auth from './components/Auth';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import SavedComparisons from './components/SavedComparison';
import ProfileUpdateForm from './components/ProfileUpdateForm';

function App() {
  const [isRegister, setIsRegister] = useState(false); // Default to login screen
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showRegisterForm = () => {
    setIsRegister(true);
  };

  const showLoginForm = () => {
    setIsRegister(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <AppContent
        isRegister={isRegister}
        showRegisterForm={showRegisterForm}
        showLoginForm={showLoginForm}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
      />
    </Router>
  );
}

function AppContent({ isRegister, showRegisterForm, showLoginForm, isLoggedIn, handleLogout, handleLogin }) {
  const location = useLocation();

  return (
    <>
      <NavBar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        showLoginForm={showLoginForm}
        currentPath={location.pathname}
      />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/saved-comparisons" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SavedComparisons />
            </ProtectedRoute>
          } />
          <Route
            path="/auth"
            element={<Auth isRegister={isRegister} handleLogin={handleLogin} showRegisterForm={showRegisterForm} showLoginForm={showLoginForm} />}
          />
          <Route path="/compare" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <PriceComparisonForm />
            </ProtectedRoute>
          } />
          <Route path="/update-profile" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProfileUpdateForm />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
