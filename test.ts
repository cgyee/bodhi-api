import db, { Job } from "./db";
import { describe, it, expect } from "@jest/globals";

const staticData = {
  eventName: "Morning Scene",
  startDate: "2024-01-01",

  endDate: "2024-01-31",
  recurrence: {
    interval: 1,
    frequency: "day",
  },
} as Job;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("create job", () => {
  const data = staticData;
  it(`should return true for ${data.eventName}`, async () => {
    const ok = await db.create({ ...data });
    expect(ok).toBe(true);
  });
});

describe("find job", () => {
  const data = staticData;
  const dummyData = {
    eventName: "Test Scene",
    startDate: "2024-01-01",

    endDate: "2024-01-31",
    recurrence: {
      interval: 1,
      frequency: "day",
    },
  } as Job;
  it('should return a job null for "Test Scene"', async () => {
    const job = await db.findOne({ ...dummyData });
    expect(job).toEqual(null);
  });
  it('should return a job object for "Morning Scence"', async () => {
    const job = await db.findOne({ ...data });
    expect(job?.eventName).toBe(data.eventName);
  });
});

describe("update job", () => {
  const data = staticData;
  const dummyData = {
    eventName: "Test Scene",
    startDate: "2024-01-01",

    endDate: "2024-01-31",
    recurrence: {
      interval: 2,
      frequency: "day",
    },
  } as Job;
  describe(`updating ${data.eventName}`, () => {
    it(`should return true for ${data.eventName}`, async () => {
      const ok = await db.update({ ...data }, dummyData);
      expect(ok).toBe(true);
    });
  });
  describe("checking update", () => {
    it(`should return false for ${data.eventName}`, async () => {
      await sleep(100);
      const job = await db.findOne({ ...data });
      expect(job).toBe(null);
    });
  });
  describe(`finding updated job ${dummyData.eventName}`, () => {
    it(`should return a job object for ${dummyData.eventName}`, async () => {
      await sleep(100);
      const job = await db.findOne({ ...dummyData });
      expect(job?.eventName).toBe(dummyData.eventName);
    });
  });
});

describe("remove a job", () => {
  const data = {
    eventName: "Test Scene",
    startDate: "2024-01-01",

    endDate: "2024-01-31",
    recurrence: {
      interval: 1,
      frequency: "day",
    },
  } as Job;
  it(`should return true for ${data.eventName}`, async () => {
    const ok = await db.remove({ ...data });
    expect(ok).toBe(true);
  });
});
