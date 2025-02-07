import express from "express";
import { missingFields } from "../utils";
import database, { Job } from "../db";
const router = express.Router();

const db = database;

router.get("/jobs", async (req, res, next) => {
  const job = <Job>req.body;
  const [missedProps, missing] = missingFields(job);
  if (missing) {
    res.status(400).send(`Missing fields: ${missedProps.join(", ")}`);
  }
  // check cache
  // if not in cache, check db
  res.status(404).send("Job not found");
  res.status(200).send("Job found");
});
router.post("/jobs", async (req, res, next) => {
  const job = <Job>req.body;
  const [missedProps, missing] = missingFields(job);
  if (missing) {
    res.status(400).send(`Missing fields: ${missedProps.join(", ")}`);
  }
  // check cache
  // if not in cache, write to db then cache

  res.status(404).send("Job not found");
  res.status(201).send("Job created");
});
router.put("/jobs/:id", async (req, res, next) => {
  const id = req.params.id;
  // check cache
  // if not in cache, check db
  // if in db proceed to process job data
  const job = <Job>req.body;
  const [missedProps, missing] = missingFields(job);
  if (missing) {
    res.status(400).send(`Missing fields: ${missedProps.join(", ")}`);
  }
  // updata db
});
router.delete("/jobs:id", async (req, res, next) => {
  const id = req.params.id;
  // check cache
  // if not in cache, check db
  // if in db proceed to process job data
  const job = <Job>req.body;
  const [missedProps, missing] = missingFields(job);
  if (missing) {
    res.status(400).send(`Missing fields: ${missedProps.join(", ")}`);
  }
  // updata db
});

export default router;
