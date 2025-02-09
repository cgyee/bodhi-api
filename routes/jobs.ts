import express from "express";
import { removeFields, validateJob } from "../utils.ts";
import db, { type Job } from "../db.ts";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // check cache
    // if not in cache, check db
    const jobs = (await db.findAll()).map((j) => removeFields(j));
    if (jobs.length === 0) {
      res.status(404).send({ error: true, message: "No jobs found" });
    }
    res.status(200).send(jobs);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: true, message: `Internal server error: ${error}` });
  }
});

router.post("/", async (req, res, next) => {
  try {
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
    const resultJob = db.findOne({ ...job });
    if (!result) {
      res
        .status(400)
        .send({ error: true, message: "Matching job eventName found" });
    }
    res.status(201).send(resultJob);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: true, message: `Internal server error: ${error}` });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const job = <Job>req.body;
    const [result, valid] = validateJob(
      job,
      req.body.startDate,
      req.body.endDate
    );
    if (!valid) {
      res.status(400).send({ error: true, message: result });
    }
    // check cache
    // if not in cache, check db
    // update db
    const ok = db.update({ id, eventName: "" }, { ...job });
    if (!ok) {
      res.status(400).send({ error: true, message: "Job not found" });
    }
    res.status(204).send(job);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: true, message: `Internal server error: ${error}` });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    // check cache
    // if not in cache, check db
    // if in db proceed to process job data
    const ok = db.remove({ id, eventName: "" });
    if (!ok) {
      res.status(400).send({ error: true, message: "Job not found" });
    }
    res.status(204).send("Job deleted");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: true, message: `Internal server error: ${error}` });
  }
});

export default router;
