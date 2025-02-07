import { Job } from "./db";

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

const missingFields = (job: Job): [string, boolean] => {
  const missingProps = (Object.keys(job) as (keyof Job)[]).filter(
    (key) => job[key] === undefined
  );
  if (missingProps.length > 0) {
    console.log(`Missing fields: ${missingProps.join(", ")}`);
    return [`Missing fields: ${missingProps.join(", ")}`, true];
  }
  return ["", false];
};

const validateJob = (
  job: Job,
  startDate: string,
  endDate: string
): [string, boolean] => {
  if (startDate === "" || endDate === "") {
    return ["Invalid date format", false];
  }
  const start = dataParser(startDate);
  const end = dataParser(endDate);
  if (start == null || end == null) {
    return ["Invalid date format", false];
  }
  job.startDate = start;
  job.endDate = end;
  const [missedProps, missing] = missingFields(job);
  if (missing) {
    return [missedProps, false];
  }
  return ["", true];
};

export { missingFields, validateJob };
