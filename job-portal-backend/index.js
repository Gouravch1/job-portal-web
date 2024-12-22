const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require('path');
const port = process.env.PORT || 5000;



const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock data for jobs (temporary storage for simplicity)
let jobs = [];
let applications = [];

const apiKey = "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";

// Chatbot endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Ensure a message was sent
    if (!message) {
      return res.status(400).send("Message is required.");
    }

    // Prepare the request body for OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/completions", // endpoint for chat completions
      {
        model: "text-davinci-003",  // Use the proper model
        prompt: message,            // Pass the user's message
        max_tokens: 150,            // Limit the response size
        temperature: 0.7,           // adjust for randomness in the response
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`, 
        },
      }
    );

    // Send the generated response back to the frontend
    res.json({ reply: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// Get all jobs
app.get("/jobs", (req, res) => {
  res.json(jobs);
});

// Add a new job (Admin Panel)
app.post("/jobs", (req, res) => {
  const { title, location, salary, contact_email, description } = req.body;

  if (!title || !location || !salary || !contact_email || !description) {
    return res.status(400).send("All fields are required.");
  }

  const newJob = {
    id: jobs.length + 1,
    title,
    location,
    salary,
    contact_email,
    description,
  };

  jobs.push(newJob);
  res.status(201).send("Job added successfully.");
});

// Submit a job application (Candidate Portal)
app.post("/candidate/apply", (req, res) => {
  const { candidate_name, contact, job_id } = req.body;

  if (!candidate_name || !contact || !job_id) {
    return res.status(400).send("All fields are required.");
  }

  const job = jobs.find((j) => j.id === job_id);
  if (!job) {
    return res.status(404).send("Job not found.");
  }

  const application = {
    application_id: applications.length + 1,
    candidate_name,
    contact,
    job_id,
  };

  applications.push(application);
  res.status(201).send("Application submitted successfully.");
});


app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve React app for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


