import { ObjectId } from "mongoose";
import LessonDto from "../dtos/LessonDto";
import ModuleDto from "../dtos/ModuleDto";
import ApiError from "../exceptions/ApiError";
import courseModel, { CourseInput } from "../models/course.model";
import lessonModel, { LessonDocument } from "../models/lesson.model";
import moduleModel, { ModuleDocument } from "../models/module.model";

class courseService {
  async getCourse(course: ObjectId | string) {
    const Course = await courseModel.findById(course);
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return Course;
  }

  async createCourse(courseData: CourseInput) {
    const Course = await courseModel.create(courseData);
    return Course;
  }

  async updateCourse(id: ObjectId | string, courseData: CourseInput) {
    const Course = await courseModel.findByIdAndUpdate(id, courseData, {
      new: true,
    });
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return Course;
  }

  async deleteCourse(id: ObjectId | string) {
    const Course = await courseModel.findByIdAndDelete(id);
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    await moduleModel.deleteMany({ course: id });
    await lessonModel.deleteMany({ course: id });
    return Course;
  }

  async getModule(module: ObjectId | string) {
    const Module = await moduleModel.findById(module);
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    return new ModuleDto(Module);
  }

  async createModule(
    course: ObjectId | string,
    title: string,
    description: string
  ) {
    const Course = await courseModel
      .findById(course)
      .populate<{ modules: ModuleDocument[] }>("modules");
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    const newModule: any = {
      course,
      title,
      description,
      index: Course.modules.length,
    };
    const Module = await moduleModel.create(newModule);
    if (!Module) {
      throw ApiError.BadRequest("При создании модуля произошла ошибка");
    }
    return new ModuleDto(Module);
  }

  async updateModule(
    id: ObjectId | string,
    title: string,
    description: string
  ) {
    const Module = await moduleModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    return Module;
  }

  async deleteModule(id: ObjectId | string) {
    const Module = await moduleModel.findById(id);
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    await moduleModel.updateMany(
      { course: Module.course, index: { $gt: Module.index } },
      { $inc: { index: -1 } }
    );
    await lessonModel.deleteMany({ module: id });
    await Module.delete();
  }

  async getLesson(lesson: ObjectId | string) {
    const Lesson = await lessonModel.findById(lesson);
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    return new LessonDto(Lesson);
  }
  async createLesson(
    module: string,
    title: string,
    description: string,
    content: string,
    withExercise: boolean,
    exercise: string
  ) {
    const Module = await moduleModel
      .findById(module)
      .populate<{ lessons: LessonDocument[] }>("lessons");
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    const newLesson: any = {
      index: Module.lessons.length,
      course: Module.course,
      module,
      title,
      description,
      content,
      withExercise,
      exercise,
    };
    const Lesson = await lessonModel.create(newLesson);
    return new LessonDto(Lesson);
  }
  async updateLesson(
    id: string,
    title: string,
    description: string,
    content: string,
    withExercise: boolean,
    exercise: string
  ) {
    const Lesson = await lessonModel.findByIdAndUpdate(
      id,
      { title, description, content, withExercise, exercise },
      {
        new: true,
      }
    );
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    return new LessonDto(Lesson);
  }
  async deleteLesson(id: ObjectId | string) {
    const Lesson = await lessonModel.findById(id);
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    await lessonModel.updateMany(
      { module: Lesson.module, index: { $gt: Lesson.index } },
      { $inc: { index: -1 } }
    );
    await Lesson.delete();
  }
}
export default new courseService();
