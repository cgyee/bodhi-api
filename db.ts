import { DatabaseSync } from "node:sqlite";
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

export interface WorkerJob extends Job {
  lastRun?: Date;
  nextRun?: Date;
  runTimes?: number;

  
}
const findAll = (): WorkerJob[] => {
  database.open();
  const query = "SELECT * FROM jobs";
  const result = database.prepare(query);
  const jobs: WorkerJob[] = result.all().map((r) => {
    const job: WorkerJob = {
      ...r,
      }
      job.startDate = new Date(r.startDate);
      job.endDate = new Date(r.endDate);
      job.lastRun = r.lastRun ? new Date(r.lastRun) : undefined;
      job.nextRun = r.nextRun ? new Date(r.nextRun) : undefined;
    });
  database.close();
  return jobs;
};

const find = (key: string, token = ""): [Job | null, Boolean] => {
  database.open();
  if (key === "") {
    return [null, false];
  }
  let job : Job;
  if (token !== "") {
    const query = `SELECT * FROM jobs WHERE eventName = ${key} AND token = ${token}`;
    const result = database.prepare(query);
    const [r, ..._] = result.all();
    if (!r) {
      database.close();
      return [null, false];
    }

    job = {
      ...r,
      },
      job.startDate = new Date(r.startDate);
      job.endDate = new Date(r.endDate);
    };
    database.close();
    return [job, true];
  }
  const query = `SELECT * FROM jobs WHERE id = ${key}`;
  const result = database.prepare(query);
  const [r, ..._] = result.all();
  if (!r) {
    database.close();
    return [null, false];
  }
  const job: Job = {
    ...r,
    },
  };
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

export { findAll, find, create, update, remove };
export default database;
