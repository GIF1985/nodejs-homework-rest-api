import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/api/contacts-router.js";
import { HttpError } from "./helpers/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

const { DB_HOST, PORT } = process.env;
mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("Database connection successful");

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

    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error.message);
    process.exit(1);
  });
