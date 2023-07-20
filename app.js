import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/api/contacts-router.js";
import { HttpError } from "./helpers/index.js";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
  const error = new HttpError(404, "Not found");
  next(error);
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

export default app;
