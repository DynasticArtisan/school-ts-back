import { NextFunction, Request, Response } from "express";
import ApiError from "src/exceptions/ApiError";
import courseMastersService from "src/services/courseMastersService";

class MastersController {
  async createCourseMaster(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, course } = req.body;
      if (!user || !course) {
        next(ApiError.BadRequest("Недостаточно данных"));
      }
      const Master = await courseMastersService.createCourseMaster(
        user,
        course
      );
      res.json(Master);
    } catch (e) {
      next(e);
    }
  }
  async updateCourseMasterAccess(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { master } = req.params;
      const { isAvailable } = req.body;
      const Progress = await courseMastersService.updateCourseMasterAccess(
        master,
        isAvailable
      );
      res.json(Progress);
    } catch (e) {
      next(e);
    }
  }
}
export default new MastersController();
