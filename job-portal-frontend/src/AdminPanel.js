import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Form = styled.form`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputGroup = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 5px rgba(108, 99, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #6c63ff;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #574dcc;
  }
`;

const Table = styled.table`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #f5f5f5;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const AdminPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    contact_email: "",
    description: "",
  });

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchJobs();
        setFormData({
          title: "",
          location: "",
          salary: "",
          contact_email: "",
          description: "",
        });
      } else {
        alert("Failed to add job. Please try again.");
      }
    } catch (error) {
      console.error("Error adding job:", error);
      alert("An error occurred while adding the job.");
    }
  };

  return (
    <Container>
      <h1>Admin Panel</h1>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Job Title</Label>
          <Input
            type="text"
            name="title"
            placeholder="Enter job title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </InputGroup>

        <InputGroup>
          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            placeholder="Enter job location"
            value={formData.location}
            onChange={handleInputChange}
          />
        </InputGroup>

        <InputGroup>
          <Label>Salary</Label>
          <Input
            type="text"
            name="salary"
            placeholder="Enter job salary"
            value={formData.salary}
            onChange={handleInputChange}
          />
        </InputGroup>

        <InputGroup>
          <Label>Contact Email</Label>
          <Input
            type="email"
            name="contact_email"
            placeholder="Enter contact email"
            value={formData.contact_email}
            onChange={handleInputChange}
          />
        </InputGroup>

        <InputGroup>
          <Label>Description</Label>
          <Input
            type="text"
            name="description"
            placeholder="Enter job description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </InputGroup>

        <Button type="submit">Add Job</Button>
      </Form>

      <h2>Job Listings</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>Title</TableHeader>
            <TableHeader>Location</TableHeader>
            <TableHeader>Salary</TableHeader>
            <TableHeader>Contact Email</TableHeader>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.salary}</TableCell>
              <TableCell>{job.contact_email}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPanel;
