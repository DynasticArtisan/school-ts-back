import { ObjectId } from "mongoose";
import ApiError from "src/exceptions/ApiError";
import homeworkFilesModel, {
  IHomeworkFile,
} from "src/models/homeworkFilesModel";
import homeworkModel, { IHomework } from "src/models/homeworkModel";
import { HomeworkStatus } from "src/utils/statuses";

const HomeworkDto = require("../dtos/HomeworkDto");
const homeworkVerifyModel = require("../models/homeworkVerifyModel");

class HomeworkService {
  async createHomework(user: ObjectId, lesson: ObjectId, course: ObjectId) {
    const PrevHomework = await homeworkModel.findOne({
      user,
      lesson,
    });
    if (PrevHomework) {
      throw ApiError.BadRequest("Домашнее задание уже было создано");
    }
    return await homeworkModel.create({ user, lesson, course });
  }

  async getHomework(id: ObjectId) {
    const Homework = await homeworkModel
      .findById(id)
      .populate("user")
      .populate("files")
      .lean();
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }
    return Homework;
  }

  async getLessonHomeworks(lesson: ObjectId) {
    const Homeworks = await homeworkModel
      .find({ lesson })
      .populate("user")
      .lean();
    return Homeworks.map((homework) => new HomeworkDto(homework));
  }

  async updateHomework(id: ObjectId, status: HomeworkStatus) {
    await homeworkModel.findOneAndUpdate(id, { status }, { new: true });
  }

  async createFile(
    homework: ObjectId,
    user: ObjectId,
    filename: string,
    filepath: string
  ) {
    return await homeworkFilesModel.create({
      homework,
      user,
      filename,
      filepath,
    });
  }

  async verifyHomework(homework: any, data: any, user: any) {
    const Homework = await homeworkModel.findByIdAndUpdate(homework, data, {
      new: true,
    });
    if (!Homework) {
      throw ApiError.BadRequest("Домашнее задание не найдено");
    }
    const Verified = await homeworkVerifyModel.findOne({ homework, user });
    if (!Verified) {
      await homeworkVerifyModel.create({
        homework,
        user,
        course: Homework.course,
      });
    }
    return new HomeworkDto(Homework);
  }

  //   async createHomework(payload: any, file: any) {
  //     const PrevHomework = await homeworkModel.findOne(payload);
  //     if (PrevHomework) {
  //       throw ApiError.BadRequest("Домашнее задание уже было создано");
  //     }
  //     const Homework = await homeworkModel.create(payload);
  //     const File = await homeworkFilesModel.create({
  //       ...file,
  //       homework: Homework._id,
  //       user: Homework.user,
  //     });
  //     Homework.files = [File];
  //     return new HomeworkDto(Homework);
  //   }

  //   async updateHomework(homework, payload, file) {
  //     const Homework = await homeworkModel
  //       .findOneAndUpdate(homework, payload, { new: true })
  //       .populate("files");
  //     if (!Homework) {
  //       throw ApiError.BadRequest("Домашнее задание не найдено");
  //     }
  //     const File = await homeworkFilesModel.create({
  //       ...file,
  //       homework: Homework._id,
  //     });
  //     Homework.files = [...Homework.files, File];
  //     return new HomeworkDto(Homework);
  //   }

  //   async getLessonHomeworks(lesson: any) {
  //     const Homeworks = await homeworkModel
  //       .find({ lesson })
  //       .populate("user")
  //       .lean();
  //     return Homeworks.map((homework) => new HomeworkDto(homework));
  //   }
  //   async getsHomework(id) {
  //     const Homework = await homeworkModel
  //       .findById(id)
  //       .populate([
  //         {
  //           path: "user",
  //           select: "name surname",
  //         },
  //         {
  //           path: "files",
  //           options: {
  //             sort: "createdAt",
  //           },
  //         },
  //       ])
  //       .lean();
  //     if (!Homework) {
  //       throw ApiError.BadRequest("Домашнее задание не найдено");
  //     }
  //     return new HomeworkDto(Homework);
  //   }

  async deleteUserHomeworks(user: any) {
    await homeworkModel.deleteMany({ user });
    await homeworkFilesModel.deleteMany({ user });
    await homeworkVerifyModel.deleteMany({ user });
  }
}

export default new HomeworkService();
