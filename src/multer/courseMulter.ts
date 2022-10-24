import { Request } from "express";
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

export default multer({ storage, fileFilter }).fields(fields);
