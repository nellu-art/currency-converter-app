import express from "express";
import cors from "cors";
import createError from "http-errors";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import timeout from "connect-timeout";

import currencyRouter from "./routes/currency.router.js";
import { setUpdateJob } from "./controllers/setUpdateJob.js";
import { authenticateKey } from "./utils/apiAuth.js";

const app = express();
const port = 3000;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// app.set('trust proxy', 2)

app.use(timeout("20s"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());
app.use(limiter);

app.get("/", (_, res) => {
  return res.redirect("/currencies/list");
});

app.use("/currencies", authenticateKey, currencyRouter);

// Handle timeout errors
app.use(function (req, res, next) {
  if (!req.timedout) next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    error:
      req.app.get("env") === "development" ? { ...err, stack: err.stack } : {},
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);

  setUpdateJob();
});
