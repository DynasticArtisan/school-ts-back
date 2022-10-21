import { TokenUser } from "src/services/tokenService";

declare global {
  namespace Express {
    interface Request {
      user: TokenUser;
      file: File;
      files: any;
      course: any;
      module: any;
    }
  }
}

type File = {
  filename: string;
  filepath: string;
};
