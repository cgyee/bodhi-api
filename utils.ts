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

const missingFields = (job: Job): [string[], boolean] => {
  const missingProps = (Object.keys(job) as (keyof Job)[]).filter(
    (key) => job[key] === undefined
  );
  if (missingProps.length > 0) {
    console.log(`Missing fields: ${missingProps.join(", ")}`);
    return [missingProps, true];
  }
  return [[], false];
};

export { missingFields };
