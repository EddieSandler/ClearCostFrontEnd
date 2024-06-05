import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Container,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./PriceComparisonForm.css";

//this form is designed to allow users to select procedures form different facilities
// and compare prices
const PriceComparisonForm = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  // request to retieve all exisitng procedures form the database
  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/procedures", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOptions(
          response.data.map((procedure) => ({
            label: procedure.procedure_name,
            id: procedure.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching procedures:", error);
      }
    };

    fetchProcedures();
  }, []);

  const handleOptionChange = async (event, newValue) => {
    if (newValue) {
      setSelectedOption(newValue);
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/compare", {
          params: { procedureId: newValue.id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setSelectedOption(null);
      setResult(null);
    }
  };

  const handleSelectCard = (facilityName) => {
    setSelectedCards((prevSelected) => {
      if (prevSelected.includes(facilityName)) {
        return prevSelected.filter((name) => name !== facilityName);
      } else {
        return [...prevSelected, facilityName];
      }
    });
  };

  const clearSelection = () => {
    setSelectedOption(null);
    setResult(null);
    setSelectedCards([]);
  };

  const saveComparison = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please log in to save comparisons");
      return;
    }

    const comparison = selectedCards.map((facilityName) => {
      const selectedFacility = result.find(
        (item) => item.facility_name === facilityName
      );
      return {
        procedure_name: selectedFacility.procedure_name,
        facility_name: selectedFacility.facility_name,
        price: selectedFacility.price,
      };
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/save-comparison",
        {
          comparison,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Procedures saved successfully");
      } else {
        alert("Failed to save procedures");
      }
    } catch (error) {
      console.error("Error saving procedures:", error);
      alert("Failed to save procedures");
    }
  };

  const calculatePriceDifference = () => {
    if (selectedCards.length === 2) {
      const [facility1, facility2] = selectedCards.map((facilityName) =>
        result.find((item) => item.facility_name === facilityName)
      );
      const priceDifference = Math.abs(
        parseFloat(facility1.price) - parseFloat(facility2.price)
      );
      return priceDifference.toFixed(2);
    }
    return null;
  };

  const multiplyByCoinsurance = (price) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const user = JSON.parse(atob(token.split(".")[1])); // Decode token payload
      const coinsurance = user.coinsurance;
      return (price * (coinsurance / 100)).toFixed(2);
    }
    return price;
  };

  return (
    <div className="fullscreen-background">
      <Container className="formContainer">
        <Typography
          variant="h3"
          gutterBottom
          className="price-comparison-heading"
        >
          Price Comparison
        </Typography>
        <div className="autocomplete-container">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose an option"
                className="dark-textfield"
              />
            )}
            style={{ width: 300 }}
            onChange={handleOptionChange}
            value={selectedOption}
          />
        </div>

        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          {result &&
            result.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.facility_name}>
                <Card variant="outlined" className="card">
                  <CardContent className="card-content">
                    <Typography variant="h5" component="div">
                      {item.procedure_name}
                    </Typography>
                    <Typography variant="body2">
                      Facility: {item.facility_name}
                    </Typography>
                    <Typography variant="body2">
                      Price: ${item.price}
                    </Typography>
                    <Typography variant="body2">
                      Your Estimated Co-Insurance cost: $
                      {multiplyByCoinsurance(item.price)}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedCards.includes(item.facility_name)}
                          onChange={() => handleSelectCard(item.facility_name)}
                        />
                      }
                      label="Select for Comparison"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {selectedCards.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <Typography variant="h5">Comparison</Typography>
            {selectedCards.map((facilityName) => {
              const selectedFacility = result.find(
                (item) => item.facility_name === facilityName
              );
              return (
                <Card
                  variant="outlined"
                  key={facilityName}
                  style={{ marginTop: "10px" }}
                  className="card"
                >
                  <CardContent className="card-content">
                    <Typography variant="h5" component="div">
                      {selectedFacility.procedure_name}
                    </Typography>
                    <Typography variant="body2">
                      Facility: {selectedFacility.facility_name}
                    </Typography>
                    <Typography variant="body2">
                      Price: ${selectedFacility.price}
                    </Typography>
                    <Typography variant="body2">
                      Your Estimated Co-Insurance Expense: $
                      {multiplyByCoinsurance(selectedFacility.price)}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
            {selectedCards.length === 2 && (
              <Typography variant="h5" style={{ marginTop: "20px" }}>
                Price Difference: ${calculatePriceDifference()}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={saveComparison}
              style={{ marginTop: "20px" }}
              className="MuiButton-root"
            >
              Save Procedure
            </Button>
          </div>
        )}

        {(selectedOption || selectedCards.length > 0) && (
          <Button
            variant="contained"
            color="secondary"
            onClick={clearSelection}
            style={{ marginTop: "20px" }}
            className="MuiButton-root"
          >
            Clear Selection
          </Button>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/saved-comparisons")} // Navigate to saved comparisons
          style={{ marginTop: "20px" }}
          className="MuiButton-root"
        >
          View Previous Searches
        </Button>
      </Container>
    </div>
  );
};

export default PriceComparisonForm;
