const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");

const jobs = [
  {
    title: "Senior React Developer",
    type: "Full-Time",
    description: "We are seeking a talented Front-End Developer to join our team in Boston, MA.",
    company: {
      name: "NewTek Solutions",
      contactEmail: "contact@teksolutions.com",
      contactPhone: "555-555-5555"
    }
  },
  {
    title: "Junior Backend Developer",
    type: "Part-Time",
    description: "Join our backend team to help build scalable APIs.",
    company: {
      name: "Tech Innovators",
      contactEmail: "hr@techinnovators.com",
      contactPhone: "555-555-1234"
    }
  },
];

describe("Job Controller", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Job.insertMany(jobs);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/jobs
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  // Test POST /api/jobs
  it("should create a new job when POST /api/jobs is called", async () => {
    const newJob = {
      title: "Mid-Level DevOps Engineer",
      type: "Full-Time",
      description: "We are looking for a DevOps Engineer to join our team.",
      company: {
        name: "Cloud Solutions",
        contactEmail: "jobs@cloudsolutions.com",
        contactPhone: "555-555-6789"
      }
    };

    await api
      .post("/api/jobs")
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobTitles = jobsAfterPost.map((job) => job.title);
    expect(jobTitles).toContain(newJob.title);
  });


 
});
