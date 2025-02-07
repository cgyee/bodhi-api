import sqlite, { DatabaseSync } from "node:sqlite";
const database = new DatabaseSync("./db.sqlite");
export interface Job {
  id: string;
  eventName: string;
  startDate: Date;
  endDate: Date;
  recurrence: {
    interval: number;
    frequency: string;
  };
}

const find = (key: string, token = ""): [Job | null, Boolean] => {
  database.open();
  if (key === "") {
    return [null, false];
  }
  let job = {};
  if (token !== "") {
    const query = `SELECT * FROM jobs WHERE eventName = ${key} AND token = ${token}`;
    const result = database.prepare(query);
    const [r, ..._] = result.all();
    if (!r) {
      database.close();
      return [null, false];
    }

    Object.keys(r).forEach((key) => {
      job[key] = r[key];
    });
    database.close();
    return [job as Job, true];
  }
  const query = `SELECT * FROM jobs WHERE id = ${key}`;
  const result = database.prepare(query);
  const [r, ..._] = result.all();
  if (!r) {
    database.close();
    return [null, false];
  }
  Object.keys(r).forEach((key) => {
    job[key] = r[key];
  });
  [job as Job, true];
  database.close();
  return [<Job>r, true];
};

const create = (job: Job) => {
  database.open();
  const query = `INSERT INTO jobs (id, eventName, startDate, endDate, interval, frequnecy) VALUES (${job.id}, ${job.eventName}, ${job.startDate}, ${job.endDate}, ${job.recurrence.interval}, ${job.recurrence.frequency})`;
  const commit = database.prepare(query);
  try {
    commit.run();
  } catch (error) {
    console.log(error);
    return [error, false];
  }
  database.close();
  return [null, true];
};

const update = (job: Job): [unknown | null, boolean] => {
  database.open();
  const query = `UPDATE jobs SET startDate = ${job.startDate}, endDate = ${job.endDate}, interval = ${job.recurrence.interval}, frequency = ${job.recurrence.frequency}, eventName = ${job.eventName} WHERE id = ${job.id}`;
  const commit = database.prepare(query);
  try {
    commit.run();
  } catch (error) {
    console.log(error);
    database.close();
    return [error, false];
  }
  database.close();
  return [null, true];
};

const remove = (key: string): [unknown | null, boolean] => {
  database.open();
  const query = `DELETE FROM jobs WHERE id = ${key}`;
  const commit = database.prepare(query);
  try {
    commit.run();
  } catch (error) {
    console.log(error);
    return [error, false];
  }
  database.close();
  return [null, true];
};

export { find, create, update, remove };
export default database;
