import express from "express";
import { missingFields, validateJob } from "../utils";
import { find, Job, update } from "../db";
const router = express.Router();

router.get("/jobs", async (req, res, next) => {
  const job = <Job>req.body;

  // check cache
  // if not in cache, check db
  let [j, ok] = find(job.eventName);
  if (!ok) {
    res.status(404).send("Job not found");
  }
  res.status(200).send(j);
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
  let [j, ok] = find(job.id);
  if (!ok) {
    res.status(404).send("Job not found");
  }
  // update db
  update(job);
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

const dataParser = (dateStr: string): Date | null => {
  let date: Date;
  try {
    date = new Date(dateStr);
  } catch (error) {
    console.log(error);
    return null;
  }
  return date;
};

export default router;
