import { CourseImageFiles, FileField } from "src/multer/types";
import TokenDto from "../../src/dtos/token.dto";

declare global {
  namespace Express {
    interface Request {
      user: TokenDto;
      // file: Express.Multer.File;
      // files: {
      //   image: Express.Multer.File[];
      //   icon: Express.Multer.File[];
      // };
    }
  }
}
