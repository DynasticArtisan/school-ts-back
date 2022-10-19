import { TokenUser } from "src/services/tokenService";

declare global {
  namespace Express {
    interface Request {
      user: TokenUser;
      file: any;
      files: any;
    }
  }
}
