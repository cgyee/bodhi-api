// Create a test file for db.ts getJob function
import { describe, it, expect } from "@jest/globals";
import { find } from "./db";

describe("find job", () => {
  it("should return a job object", () => {
    const [job, found] = find("test");
    expect(job).toEqual({
      eventName: "test",
      startDate: "2021-10-10",
      endDate: "2021-10-10",
      recurrence: {
        interval: 1,
        frequency: "daily",
      },
    });
    expect(found).toBe(true);
  });
  it("should return null if job is not found", () => {
    const [job, found] = find("test2");
    expect(job).toBe(null);
    expect(found).toBe(false);
  });
});
