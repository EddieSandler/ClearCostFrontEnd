// src/pages/AdminPage.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [cptCode, setCptCode] = useState('');
  const [procedureName, setProcedureName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [price, setPrice] = useState('');
  const [procedureId, setProcedureId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [pricingId, setPricingId] = useState('');

  const handleAddProcedure = async () => {
    try {
      const response = await axios.post('https://backend-service-4snlfkepaq-uc.a.run.app/add-procedure', {
        cpt_code: cptCode,
        procedure_name: procedureName,
        facility_name: facilityName,
        price: price
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error adding procedure:', error);
    }
  };

  const handleUpdateProcedure = async () => {
    try {
      const response = await axios.put(`https://backend-service-4snlfkepaq-uc.a.run.app/update-procedure/${procedureId}`, {
        cpt_code: cptCode,
        procedure_name: procedureName
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating procedure:', error);
    }
  };

  const handleUpdateFacility = async () => {
    try {
      const response = await axios.put(`https://backend-service-4snlfkepaq-uc.a.run.app/update-facility/${facilityId}`, {
        facility_name: facilityName
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating facility:', error);
    }
  };

  const handleUpdatePrice = async () => {
    try {
      const response = await axios.put(`https://backend-service-4snlfkepaq-uc.a.run.app/update-price/${pricingId}`, {
        procedure_id: procedureId,
        facility_id: facilityId,
        price: price
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating pricing:', error);
    }
  };

  const handleDeleteProcedure = async () => {
    try {
      const response = await axios.delete(`https://backend-service-4snlfkepaq-uc.a.run.app/delete-procedure/${procedureId}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error deleting procedure:', error);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <h2>Add Procedure</h2>
        <input placeholder="CPT Code" value={cptCode} onChange={(e) => setCptCode(e.target.value)} />
        <input placeholder="Procedure Name" value={procedureName} onChange={(e) => setProcedureName(e.target.value)} />
        <input placeholder="Facility Name" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button onClick={handleAddProcedure}>Add</button>
      </div>
      <div>
        <h2>Update Procedure</h2>
        <input placeholder="Procedure ID" value={procedureId} onChange={(e) => setProcedureId(e.target.value)} />
        <input placeholder="CPT Code" value={cptCode} onChange={(e) => setCptCode(e.target.value)} />
        <input placeholder="Procedure Name" value={procedureName} onChange={(e) => setProcedureName(e.target.value)} />
        <button onClick={handleUpdateProcedure}>Update</button>
      </div>
      <div>
        <h2>Update Facility</h2>
        <input placeholder="Facility ID" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} />
        <input placeholder="Facility Name" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} />
        <button onClick={handleUpdateFacility}>Update</button>
      </div>
      <div>
        <h2>Update Price</h2>
        <input placeholder="Pricing ID" value={pricingId} onChange={(e) => setPricingId(e.target.value)} />
        <input placeholder="Procedure ID" value={procedureId} onChange={(e) => setProcedureId(e.target.value)} />
        <input placeholder="Facility ID" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button onClick={handleUpdatePrice}>Update</button>
      </div>
      <div>
        <h2>Delete Procedure</h2>
        <input placeholder="Procedure ID" value={procedureId} onChange={(e) => setProcedureId(e.target.value)} />
        <button onClick={handleDeleteProcedure}>Delete</button>
      </div>
    </div>
  );
};

export default AdminPage;
