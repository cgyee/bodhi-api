import express from "express";
import { removeFields, validateJob } from "../utils.ts";
import db, { type Job } from "../db.ts";
const router = express.Router();

type ResponseMessage = { error: boolean; message: string } | Job[] | Job;

router.get("/", async (req, res, next) => {
  let status = 500;
  let message: ResponseMessage = {
    error: true,
    message: "Internal server error",
  };
  try {
    // check cache
    // if not in cache, check db
    const jobs = (await db.findAll()).map((j) => removeFields(j));
    if (jobs.length === 0) {
      status = 404;
      message = { error: true, message: "No jobs found" };
      // res.status(404).send({ error: true, message: "No jobs found" });
    } else {
      // res.status(200).send(jobs);
      status = 200;
      message = jobs;
    }
  } catch (error) {
    console.log(error);
    // res
    status = 500;
    message = { error: true, message: `Internal server error: ${error}` };
  } finally {
    res.status(status).json(message);
  }
});

router.post("/", async (req, res, next) => {
  let status = 500;
  let message: ResponseMessage = {
    error: true,
    message: "Internal server error",
  };
  try {
    const job = <Job>req.body;
    const [result, valid] = validateJob(
      job,
      req.body.startDate,
      req.body.endDate
    );
    if (!valid) {
      status = 400;
      message = { error: true, message: result };
    }
    // check cache
    // if not in cache, write to db then cache
    const resultJob = await db.findOne({ ...job });
    if (resultJob == null) {
      status = 400;
      message = { error: true, message: "Matching job eventName found" };
    } else {
      status = 201;
      message = resultJob;
    }
  } catch (error) {
    console.log(error);
    res;
    status = 500;
    message = { error: true, message: `Internal server error: ${error}` };
  } finally {
    res.status(status).json(message);
  }
});

router.put("/:id", async (req, res, next) => {
  let status = 500;
  let message: ResponseMessage = {
    error: true,
    message: "Internal server error",
  };
  try {
    const id = req.params.id;
    const job: Job = req.body;
    const [result, valid] = validateJob(
      job,
      req.body.startDate,
      req.body.endDate
    );
    if (!valid) {
      status = 400;
      message = { error: true, message: result };
    }
    // check cache
    // if not in cache, check db
    // update db
    const ok = db.update({ id, eventName: "" }, { ...job });
    if (!ok) {
      // res.status(400).send({ error: true, message: "Job not found" });
      status = 400;
      message = { error: true, message: "Job not found" };
    } else {
      // res.status(204).send(job);
      status = 204;
      message = job;
    }
  } catch (error) {
    console.log(error);
    status = 500;
    message = { error: true, message: `Internal server error: ${error}` };
  } finally {
    res.status(status).json(message);
  }
});

router.delete("/:id", async (req, res, next) => {
  let status = 500;
  let message: ResponseMessage = {
    error: true,
    message: "Internal server error",
  };
  try {
    const id = req.params.id;
    // check cache
    // if not in cache, check db
    // if in db proceed to process job data
    const ok = db.remove({ id, eventName: "" });
    if (!ok) {
      status = 400;
      message = { error: true, message: "Job not found" };
    } else {
      status = 204;
      message = { error: false, message: "Job deleted" };
    }
  } catch (error) {
    console.log(error);
    status = 500;
    message = { error: true, message: `Internal server error: ${error}` };
  } finally {
    res.status(status).json(message);
  }
});

export default router;
