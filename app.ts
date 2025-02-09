// import createError from "http-errors";
// import cookieParser from "cookie-parser";
import express from "express";

import jobsRouter from "./routes/jobs.ts";

const port = 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use("/jobs", jobsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
