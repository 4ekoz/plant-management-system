import React, { useEffect, useState } from "react";
import styles from "./plant.module.css";
import {  FaMinus,  } from "react-icons/fa";
import { BiHistory } from "react-icons/bi";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { color, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const generateValidObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, "0");
  const random = Math.random().toString(16).slice(2).padStart(16, "0");
  return timestamp + random;
};
function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        toast.error("Please login first");
        navigate("/login");
        return;
      }
      console.log("Using token from localStorage");
      const response = await axios.get(
        "https://green-world-vert.vercel.app/plant",
        {
          headers: {
            token: token,
          },
        }
      );
      console.log("API Response:", response.data);

      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          setPlants(response.data.data);
          console.log(plants);
          console.log("Plants loaded:", response.data.data.length);
        } else {
          console.error("Plants data is not an array:", response.data.data);
          setError("Invalid data format received");
        }
      } else {
        setError("Failed to fetch plants");
        console.error("API returned success: false");
      }
    } catch (err) {
      console.error("Error fetching plants:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again");
        navigate("/login");
      } else {
        setError(err.message || "An error occurred while fetching plants");
        toast.error("Failed to load plants");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlants();
  }, [navigate]);

  // إضافة console.log لتتبع حالة المكون
  console.log("Current state:", {
    loading,
    error,
    plantsLength: plants?.length,
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="xl" color="#2c7a4b" />
        <p>Loading plants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
      </div>
    );
  }

  // إضافة console.log قبل عرض الجدول
  console.log("Rendering table with plants:", plants);

  return (
    <motion.div
      className={styles.plantContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={styles.title}>Plants List</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.plantTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Scientific Name</th>
              <th>Category</th>
              <th>Origin</th>
              <th>Watering</th>
              <th>Soil Type</th>
              <th>Temperature</th>
              <th>Image</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {plants.length > 0 ? (
              plants.map((plant) => (
                <motion.tr
                  key={plant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                    <td>{plant.name}</td>
             
                  <td>{plant.scientificName}</td>
                  <td>{plant.category}</td>
                  <td>{plant.origin}</td>
                  <td>{plant.wateringFrequency}</td>
                  <td>{plant.soilType}</td>
                  <td>
                    {plant.temperatureRange
                      ? `${plant.temperatureRange.min}°C - ${plant.temperatureRange.max}°C`
                      : "N/A"}
                  </td>
                  <td>
                    {plant.Image?.secure_url ? (
                      <img
                        src={plant.Image.secure_url}
                        alt={plant.name}
                        className={styles.plantImage}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td className={styles.description}>{plant.description}</td>
                  <td className={styles.status} style={{ textAlign: "center",display:"flex", justifyContent:"center", alignItems:"center", gap:"10px" }}>
                    <Link to={""} style={{color:"white", backgroundColor:"#2c7a4b", padding:"4px", borderRadius:"50%",textAlign:"center",width:"30px", height:"30px", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <BiHistory />

                    </Link>
                    <button style={{color:"white", backgroundColor:"red", padding:"4px", borderRadius:"50%",textAlign:"center",width:"30px", height:"30px", display:"flex", justifyContent:"center", alignItems:"center"}}>
                      <FaMinus />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No plants found. Add some plants to see them here!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default PlantPage;
