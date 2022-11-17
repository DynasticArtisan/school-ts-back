import path from "path";
import config from "config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "mongoose";

import errorMiddleware from "./middlewares/error.middleware";
import router from "./routers";
import devrouter from "./routers/dev.router";

const PORT = config.get("serverPORT");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: config.get("SITEURL") }));
app.use("/api", router);
app.use("/dev", devrouter);
app.use(errorMiddleware);

app.use(
  "/images",
  express.static(path.join(__dirname, "..", "filestore/images"))
);
app.use(
  "/homeworks",
  express.static(path.join(__dirname, "filestore/homeworks/"))
);
app.use("/avatars", express.static(path.join(__dirname, "filestore/avatars/")));

const start = async () => {
  try {
    await connect(config.get("DBURL"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    app.listen(PORT, async () => {
      console.log("Server started on port ", PORT);
    });
  } catch (e: any) {
    console.log(e.message);
  }
};
start();
