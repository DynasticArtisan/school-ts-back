import { CourseImageFiles, FileField } from "src/multer/types";
import { TokenUser } from "src/services/tokenService";

declare global {
  namespace Express {
    interface Request {
      user: TokenUser;
      // file: Express.Multer.File;
      // files: {
      //   image: Express.Multer.File[];
      //   icon: Express.Multer.File[];
      // };
    }
  }
}
