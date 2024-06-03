// src/components/AdminDashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAddProcedure = async () => {
    // Logic to add a procedure
  };

  const handleDeleteProcedure = async () => {
    // Logic to delete a procedure
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Button variant="contained" color="primary" onClick={handleAddProcedure}>
        Add Procedure
      </Button>
      <Button variant="contained" color="secondary" onClick={handleDeleteProcedure}>
        Delete Procedure
      </Button>
      <Button variant="contained" color="primary" onClick={() => navigate('/compare')}>
        Back to Compare
      </Button>
    </div>
  );
};

export default AdminDashboard;
