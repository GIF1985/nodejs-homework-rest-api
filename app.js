// app.js
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/api/contacts-router.js";
import usersRouter from "./routes/api/users-router.js";
import { HttpError } from "./helpers/index.js";

require("dotenv").config();

const app = express();
const { DB_HOST, PORT, JWT_SECRET } = process.env;

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("Database connection successful");

    // Use routers for contacts and users
    app.use("/api/contacts", contactsRouter);
    app.use("/api/users", usersRouter);

    // Handling non-existing routes
    app.use((req, res, next) => {
      const error = new HttpError(404, "Not found");
      next(error);
    });

    // Error handler
    app.use((err, req, res, next) => {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error.message);
    process.exit(1);
  });
