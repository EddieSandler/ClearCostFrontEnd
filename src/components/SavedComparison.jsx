import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./PriceComparisonForm.css";

//this form is designed to display all selected procedures used in a price comparison
const SavedComparisons = () => {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComparisons = async () => {
      const token = sessionStorage.getItem("token");
      console.log("Retrieved token:", token);
      if (!token) {
        alert("Please log in to view saved procedures");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://backend-service-4snlfkepaq-uc.a.run.app/get-comparisons",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);
        if (response.status === 200) {
          setComparisons(response.data.comparisons);
        } else {
          alert("Failed to retrieve saved  procedures");
        }
      } catch (error) {
        console.error("Error retrieving saved procedures:", error);
        alert("Failed to retrieve saved procedures");
      } finally {
        setLoading(false);
      }
    };

    fetchComparisons();
  }, []);

  const deleteAllComparisons = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Please log in to delete saved procedures");
      return;
    }

    try {
      const response = await axios.delete(
        "https://backend-service-4snlfkepaq-uc.a.run.app/delete-all-comparisons",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("All saved procedures will be deleted");
        setComparisons([]);
      } else {
        alert("Failed to delete saved procedures");
      }
    } catch (error) {
      console.error("Error deleting saved procedures:", error);
      alert("Failed to delete saved procedures");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="formContainer">
      <Container>
        <Typography variant="h4" gutterBottom>
          Saved Procedures
        </Typography>
        {!Array.isArray(comparisons) || comparisons.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <Typography variant="h6">No saved procedures available.</Typography>
          </div>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center">
              {comparisons.map((comparison, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined" className="card">
                    <CardContent className="card-content">
                      <Typography variant="h6" component="div">
                        {comparison.procedure_name}
                      </Typography>
                      <Typography variant="body2">
                        Facility: {comparison.facility_name}
                      </Typography>
                      <Typography variant="body2">
                        Price: ${comparison.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              onClick={deleteAllComparisons}
              style={{ marginTop: "20px" }}
            >
              Delete
            </Button>
          </>
        )}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/compare")}
          >
            Back
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default SavedComparisons;
