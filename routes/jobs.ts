import express from "express";
import { validateJob } from "../utils";
import { findAll, find, Job, remove, update } from "../db";
const router = express.Router();

router.get("/jobs", async (req, res, next) => {
  // check cache
  // if not in cache, check db
  let j = findAll();

  const jobs = j.map((job) => ({
    ...job,
    lastRun: null,
    nextRun: null,
    runTimes: null,
  }));

  res.status(200).send(j<Job[]>);
});

router.post("/jobs", async (req, res, next) => {
  const job = <Job>req.body;
  const [result, valid] = validateJob(
    job,
    req.body.startDate,
    req.body.endDate
  );
  if (!valid) {
    res.status(400).send(result);
  }
  // check cache
  // if not in cache, write to db then cache
  let [j, ok] = find(job.id);
  if (!ok) {
    res.status(404).send("Job not found");
  }
  res.status(201).send(j);
});

router.put("/jobs/:id", async (req, res, next) => {
  const id = req.params.id;
  const job = <Job>req.body;
  const [result, valid] = validateJob(
    job,
    req.body.startDate,
    req.body.endDate
  );
  if (!valid) {
    res.status(400).send(result);
  }
  // check cache
  // if not in cache, check db
  let [_, ok] = find(job.id);
  if (!ok) {
    res.status(404).send("Job not found");
  }
  // update db
  const [err, status] = update(job);
  if (!status) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
  res.status(204).send("Job updated");
});

router.delete("/jobs:id", async (req, res, next) => {
  const id = req.params.id;
  // check cache
  // if not in cache, check db
  const [_, ok] = find(id);
  if (!ok) {
    res.status(404).send("Job not found");
  }
  // if in db proceed to process job data
  const [err, status] = remove(id);
  if (!status) {
    console.log(err);
    res.status(500).send(`Internal server error: ${err}`);
  }
  res.status(204).send("Job deleted");
});

export default router;
