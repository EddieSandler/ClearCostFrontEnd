import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './PriceComparisonForm.css';


const ProfileUpdateForm = () => {
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [copayment, setCopayment] = useState('');
  const [coinsurance, setCoinsurance] = useState('');
  const [deductible, setDeductible] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    try {
      const response = await axios.put('https://backend-service-4snlfkepaq-uc.a.run.app/api/update-profile', {
        insuranceCompany,
        copayment,
        coinsurance,
        deductible
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setMessage('Profile updated successfully');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    }
  };

  return (
    <Container className="formContainer">
      <Typography variant="h4" gutterBottom>Update Profile</Typography>
      {message && <Typography color="secondary">{message}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Insurance Company"
          variant="outlined"
          fullWidth
          margin="normal"
          value={insuranceCompany}
          className="dark-textfield"
          onChange={(e) => setInsuranceCompany(e.target.value)}
        />
        <TextField
          label="Copayment $"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          className="dark-textfield"
          value={copayment}
          onChange={(e) => setCopayment(e.target.value)}
        />
        <TextField
          label="Coinsurance %"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          className="dark-textfield"
          value={coinsurance}
          onChange={(e) => setCoinsurance(e.target.value)}
        />
         <TextField
          label="Deductible $"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          className="dark-textfield"
          value={deductible}
          onChange={(e) => setDeductible(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>Update Profile</Button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/compare')}
          >
            Back
          </Button>
        </div>
          </Container>

  );
};

export default ProfileUpdateForm;
