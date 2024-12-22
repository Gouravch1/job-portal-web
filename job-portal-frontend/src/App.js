import React, { useState, useEffect } from "react";
import AdminPanel from "./AdminPanel";
import CandidatePortal from "./CandidatePortal";
import styled from "styled-components";

const Container = styled.div`
  font-family: Arial, sans-serif;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 10px;
  right: 20px;
  padding: 10px 20px;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #574dcc;
  }
`;

const App = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [adminData, setAdminData] = useState(null); // For AdminPanel data
  const [candidateData, setCandidateData] = useState(null); // For CandidatePortal data

  // Toggle between AdminPanel and CandidatePortal
  const togglePortal = () => {
    setIsAdmin(!isAdmin);
  };

  // Fetch AdminPanel data from the backend
  const fetchAdminData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin");
      const data = await response.json();
      setAdminData(data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  // Fetch CandidatePortal data from the backend
  const fetchCandidateData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/candidate");
      const data = await response.json();
      setCandidateData(data);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  };

  // Fetch data based on the current view
  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      fetchCandidateData();
    }
  }, [isAdmin]);

  return (
    <Container>
      {isAdmin ? (
        <AdminPanel data={adminData} />
      ) : (
        <CandidatePortal data={candidateData} />
      )}
      <ToggleButton onClick={togglePortal}>
        {isAdmin ? "Switch to Candidate Portal" : "Switch to Admin Panel"}
      </ToggleButton>
    </Container>
  );
};

export default App;
