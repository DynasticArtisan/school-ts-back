import path from "path";
import config from "config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "mongoose";

import apiRouter from "./routers/apiRouter";
import errorMiddleware from "./middlewares/errorMiddleware";

const PORT = config.get("serverPORT");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: config.get("ClientURL") }));
app.use("/images", express.static(path.join(__dirname, "filestore/images")));
app.use(
  "/homeworks",
  express.static(path.join(__dirname, "filestore/homeworks/"))
);
app.use("/mail", express.static(path.join(__dirname, "filestore/mail/")));
app.use("/avatars", express.static(path.join(__dirname, "filestore/avatars/")));
app.use("/api", apiRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await connect(config.get("DBURL"), {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  } catch (e: any) {
    console.log(e.message);
  }
};
start();