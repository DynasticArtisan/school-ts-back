import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import path from "path";
import multer, { FileFilterCallback } from "multer";
import { unlinkSync } from "fs";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const types = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.diskStorage({
  destination(
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ) {
    cb(null, "filestore/homeworks");
  },
  filename(req: Request, file: Express.Multer.File, cb: FileNameCallback) {
    cb(
      null,
      req.user.id + Date.now().toString() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const HomeworkUploads = multer({ storage, fileFilter }).single("file");

export const HomeworkUploadsCancel = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file) {
    unlinkSync(req.file.path);
  }
  next(err);
};
