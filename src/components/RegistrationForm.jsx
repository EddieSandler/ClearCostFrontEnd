import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";
import "./PriceComparisonForm.css";

//tregistration form for users and admins. There is a checkbox at the bottom of the form for admins
const RegistrationForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [insurance_company, setInsuranceCompany] = useState("");
  const [copayment, setCopayment] = useState("");
  const [coinsurance, setCoinsurance] = useState("");
  const [deductible, setDeductible] = useState("");
  const [isadmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");

  // Clear the form fields on component mount
  useEffect(() => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setInsuranceCompany("");
    setCopayment("");
    setCoinsurance("");
    setDeductible("");
    setError("");
  }, []);

  const handleCheckboxChange = (event) => {
    setIsAdmin(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post("https://backend-service-4snlfkepaq-uc.a.run.app/api/register", {
        username,
        password,
        insurance_company,
        copayment: copayment || 0,
        coinsurance: coinsurance || 0,
        deductible: deductible || 0,
        isadmin,
      });
      if (response.status === 200) {
        const loginResponse = await axios.post("https://backend-service-4snlfkepaq-uc.a.run.app/api/login", {
          username,
          password,
        });
        if (loginResponse.status === 200) {
          const token = loginResponse.data.token;
          sessionStorage.setItem("token", token);
          handleLogin(); // Call handleLogin to navigate to the comparison page
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setInsuranceCompany("");
          setCopayment("");
          setCoinsurance("");
          setDeductible("");
          setError("");
        } else {
          setError("Login failed after registration");
        }
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      setError("Registration failed");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
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
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="dark-textfield"
        />
        <TextField
          label="Insurance Company"
          variant="outlined"
          fullWidth
          margin="normal"
          value={insurance_company}
          onChange={(e) => setInsuranceCompany(e.target.value)}
          className="dark-textfield"
        />
        <TextField
          label="Copayment $"
          variant="outlined"
          fullWidth
          margin="normal"
          value={copayment}
          onChange={(e) => setCopayment(e.target.value)}
          className="dark-textfield"
        />
        <TextField
          label="Co-insurance (%)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={coinsurance}
          onChange={(e) => setCoinsurance(e.target.value)}
          className="dark-textfield"
        />
        <TextField
          label="Deductible ($)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={deductible}
          onChange={(e) => setDeductible(e.target.value)}
          className="dark-textfield"
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={isadmin}
              onChange={handleCheckboxChange}
            />
            Admin
          </label>
        </div>

        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
    </Container>
  );
};

export default RegistrationForm;
