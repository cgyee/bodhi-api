import "dotenv/config";
import { MongoClient } from "mongodb";
export interface Job {
  id?: string;
  eventName: string;
  startDate: string;
  endDate: string;
  recurrence: {
    interval: number;
    frequency: string;
  };
  lastRun?: string;
  nextRun?: string;
  runTimes?: number;
}

interface params {
  id?: string;
  eventName: string;
}

interface Database {
  findAll: () => Promise<Job[]>;
  findOne: (params: params) => Promise<Job | null>;
  create: (job: Job) => Promise<Boolean>;
  createMany?: (jobs: Job[]) => Promise<Boolean>;
  update: (params: params, job: Job) => Promise<Boolean>;
  remove: (params: params) => Promise<Boolean>;
}

const connectToDatabase = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI as string);
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(process.env.MONGO_DB_NAME);
    const collection = db.collection(
      process.env.MONGO_COLLECTION_NAME as string
    );
    return { collection, close: client.close.bind(client) };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const findAll = async () => {
  const conn = await connectToDatabase();
  if (conn == null) {
    return [];
  }
  const { collection, close } = conn;
  let jobs: Job[] = [];
  try {
    if (collection == null) {
      return [];
    }
    const j = await collection.find().toArray();
    jobs = j.map((v: any) => {
      return {
        eventName: v.eventName,
        startDate: v.startDate,
        endDate: v.endDate,
        recurrence: v.recurrence,
      } as Job;
    });
  } catch (error) {
    console.log(error);
  } finally {
    close();
    return jobs;
  }
};

const findOne = async (p: params) => {
  const conn = await connectToDatabase();
  if (conn == null) {
    return null;
  }
  const { collection, close } = conn;
  let job: Job | null = null;
  try {
    const { eventName } = p;
    const query = { eventName };
    const j = await collection.findOne(query);

    if (j && j._id) {
      job = {
        eventName: j.eventName,
        startDate: j.startDate,
        endDate: j.endDate,
        recurrence: j.recurrence,
      };
    } else {
      job = null;
    }
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    close();
    return job;
  }
};

const create = async (jobs: Job): Promise<Boolean> => {
  const conn = await connectToDatabase();
  if (conn == null) {
    return false;
  }
  const { collection, close } = conn;
  let ok = false;
  try {
    const job = await collection.insertOne(jobs);
    if (!job.acknowledged) {
      ok = false;
    } else {
      ok = true;
    }
  } catch (error) {
    console.log(error);
    ok = false;
  } finally {
    close();
    return ok;
  }
};

const update = async (p: params, j: Job): Promise<Boolean> => {
  const conn = await connectToDatabase();
  if (conn == null) {
    return false;
  }
  const { collection, close } = conn;
  let ok = false;
  try {
    const { id } = p;
    const query = { id };
    const update = { $set: j };
    const options = { upsert: false };
    const job = await collection.updateOne(query, update, options);
    if (job.modifiedCount === 0) {
      ok = false;
    }
    ok = true;
  } catch (error) {
    console.log(error);
    ok = false;
  } finally {
    close();
    return ok;
  }
};

const remove = async (p: params) => {
  const conn = await connectToDatabase();
  if (conn == null) {
    return false;
  }
  const { collection, close } = conn;
  let ok = false;
  try {
    const { eventName } = p;
    const query = { eventName };
    const job = await collection.deleteOne(query);
    if (job.deletedCount === 0) {
      ok = false;
    } else {
      ok = true;
    }
  } catch (error) {
    console.log(error);
    ok = false;
  } finally {
    close();
    return ok;
  }
};
const db: Database = {
  findAll,
  findOne,
  create,
  update,
  remove,
};
export default db;
