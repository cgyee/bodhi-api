// import createError from "http-errors";
import path from "path";
// import cookieParser from "cookie-parser";
import express from "express";

import jobsRouter from "./routes/jobs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/jobs", jobsRouter);
