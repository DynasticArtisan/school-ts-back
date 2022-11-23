import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const Validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      next(e);
    }
  };

export default Validate;
