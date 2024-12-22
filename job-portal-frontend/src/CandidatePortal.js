import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Chatbot from "./chatbot";

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

function CandidatePortal() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    candidate_name: "",
    contact: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/jobs") 
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const handleSearch = () => {
    const results = jobs.filter((job) =>
      job.location.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredJobs(results);
  };

  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ candidate_name: "", contact: "" });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitApplication = () => {
    fetch("http://localhost:5000/candidate/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        job_id: selectedJob.id,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Application submitted successfully!");
          closeModal();
        } else {
          alert("Failed to submit application.");
        }
      })
      .catch((err) => console.error("Error submitting application:", err));
  };

  return (
    <Container>
      <Title>Candidate Portal</Title>
      <div>
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by location"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.location}</td>
              <td>{job.salary}</td>
              <td>{job.description}</td>
              <td>
                <Button onClick={() => openModal(job)}>Apply</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <>
          <Overlay onClick={closeModal} />
          <Modal>
            <h3>Apply for {selectedJob.title}</h3>
            <form>
              <div>
                <label>Candidate Name:</label>
                <Input
                  type="text"
                  name="candidate_name"
                  value={formData.candidate_name}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label>Contact:</label>
                <Input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleFormChange}
                />
              </div>
              <Button type="button" onClick={submitApplication}>
                Submit
              </Button>
            </form>
          </Modal>
        </>
      )}
      <Chatbot />
    </Container>
  );
}

export default CandidatePortal;
