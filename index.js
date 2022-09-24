import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./router/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;
const BASE_URL = process.env.BASE_URL;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
