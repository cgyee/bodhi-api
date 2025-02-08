var amqp = require("amqplib/callback_api");
const { findAll } = require("./db");

while (True) {
  setTimeout(() => {
    // check cache for jobs & db for jobs
    // if jobs in cache, send to queue
    jobs = findAll();
    console.log("DB opened");
  }, 10000);

  //   check that the start date and end date are valid
  for (job in jobs) {
    if (job.start_date > job.end_date) {
      console.log("Invalid date range");
    }

    if (job.interval <= job.runTimes) {
      console.log("Job has run the maximum number of times: ", job.eventName);
    }
    if (job.interval < 0) {
      console.log("Invalid interval");
    }
  }
}
