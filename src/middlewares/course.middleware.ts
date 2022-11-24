import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { unlinkSync } from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";

export type FileNameCallback = (error: Error | null, filename: string) => void;
export type DestinationCallback = (
  error: Error | null,
  destination: string
) => void;

const types = ["image/png", "image/jpeg", "image/jpg"];
const fields = [
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "icon",
    maxCount: 1,
  },
];

const storage = multer.diskStorage({
  destination(_: Request, file: Express.Multer.File, cb: DestinationCallback) {
    cb(null, "filestore/images");
  },
  filename(_: Request, file: Express.Multer.File, cb: FileNameCallback) {
    cb(
      null,
      file.fieldname + Date.now().toString() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const CourseUploads = multer({ storage, fileFilter }).fields(fields);

export const CourseUploadsCancel = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.files && !Array.isArray(req.files)) {
    if (req.files["image"]) {
      unlinkSync(req.files["image"][0].path);
    }
    if (req.files["icon"]) {
      unlinkSync(req.files["icon"][0].path);
    }
  }
  next(err);
};
