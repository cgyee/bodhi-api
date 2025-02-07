import sqlite, { DatabaseSync } from "node:sqlite";
const database = new DatabaseSync("./db.sqlite");
export interface Job {
  eventName: string;
  startDate: Date;
  endDate: Date;
  recurrence: {
    interval: number;
    frequency: string;
  };
}

const getJob = (key: string, token = ""): [Job | null, Boolean] => {
  if (key === "") {
    return [null, false];
  }
  let job = {};
  if (token !== "") {
    const query = `SELECT * FROM jobs WHERE eventName = ${key} AND token = ${token}`;
    const result = database.prepare(query);
    const [r, ..._] = result.all();
    if (!r) {
      return [null, false];
    }

    Object.keys(r).forEach((key) => {
      job[key] = r[key];
    });
    return [job as Job, true];
  }
  const query = `SELECT * FROM jobs WHERE eventName = ${key}`;
  const result = database.prepare(query);
  const [r, ..._] = result.all();
  if (!r) {
    return [null, false];
  }
  Object.keys(r).forEach((key) => {
    job[key] = r[key];
  });
  [job as Job, true];
  return [<Job>r, true];
};

const createJob = (job: Job) => {
  const query = `INSERT INTO jobs (eventName, startDate, endDate, interval, frequnecy) VALUES (${job.eventName}, ${job.startDate}, ${job.endDate}, ${job.recurrence.interval}, ${job.recurrence.frequency})`;
};

export default database;
