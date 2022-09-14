import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import router from "./router/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;

const app = express();

app.use(express.json());
app.use(cors());
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
