import { ObjectId } from "mongoose";
import CourseDto from "../dtos/CourseDto";
import LessonDto from "../dtos/LessonDto";
import ModuleDto from "../dtos/ModuleDto";
import ApiError from "../exceptions/ApiError";
import courseModel from "../models/course.model";
import { CourseMasterDocument } from "../models/courseMaster.model";
import { CourseProgressDocument } from "../models/courseProgress.model";
import { HomeworkDocument } from "../models/homework.model";
import lessonModel, { LessonDocument } from "../models/lesson.model";
import moduleModel, { ModuleDocument } from "../models/module.model";
import { UserDocument } from "../models/user.model";

class courseService {
  async createCourse(
    title: string,
    subtitle: string,
    description: string,
    image: string,
    icon: string
  ) {
    const Course = await courseModel.create({
      title,
      subtitle,
      description,
      image,
      icon,
    });
    return Course;
  }
  async updateCourse(
    courseId: string,
    title: string,
    subtitle: string,
    description: string,
    image?: string,
    icon?: string
  ) {
    const Course = await courseModel.findByIdAndUpdate(
      courseId,
      { title, subtitle, description, image, icon },
      {
        new: true,
      }
    );
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

  async getCourses() {
    const Courses = await courseModel.find();
    return Courses;
  }
  async getProgressCourses() {
    const Courses = await courseModel
      .find()
      .populate<{ totalCompleted: number }>("totalCompleted")
      .populate<{ totalInProgress: number }>("totalInProgress")
      .lean();
    return Courses;
  }
  async getUserProgressCourses(user: string) {
    const UserCourses = await courseModel
      .find()
      .populate<{
        progress: CourseProgressDocument;
        completedLessonsCount: number;
        totalLessonsCount: number;
      }>({
        path: "progress",
        match: { user },
        populate: ["completedLessonsCount", "totalLessonsCount"],
      })
      .lean();
    return UserCourses.filter((course) => course.progress);
  }
  async getMasterProgressCourses(user: string) {
    const MasterCourses = await courseModel
      .find()
      .populate<{ totalCompleted: number }>("totalCompleted")
      .populate<{ totalInProgress: number }>("totalInProgress")
      .populate<{ mastering: CourseMasterDocument }>({
        path: "mastering",
        match: { user },
      })
      .lean();
    return MasterCourses.filter((course) => course.mastering);
  }
  async getMasterHomeworkCourses(user: string) {
    const MasterCourses = await courseModel
      .find()
      .populate<{
        mastering: CourseMasterDocument;
        verifiedHomeworksCount: number;
      }>({
        path: "mastering",
        match: { user },
        populate: {
          path: "verifiedHomeworksCount",
        },
      })
      .lean();
    return MasterCourses.filter((course) => course.mastering);
  }
  async getProfileCourses(user: string) {
    const Courses = await courseModel
      .find()
      .populate<{
        mastering: CourseMasterDocument;
        progress: CourseProgressDocument;
        lastLesson: LessonDocument;
        lesson: LessonDocument;
        module: ModuleDocument;
      }>([
        {
          path: "mastering",
          match: { user },
        },
        {
          path: "progress",
          match: { user },
          populate: {
            path: "lastLesson",
            populate: [
              {
                path: "lesson",
                select: "title",
              },
              {
                path: "module",
                select: "title",
              },
            ],
          },
        },
      ])
      .lean();
    return Courses;
  }

  async getCourse(course: ObjectId | string) {
    const Course = await courseModel.findById(course);
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return Course;
  }
  async getCourseModules(course: string) {
    const Course = await courseModel
      .findById(course)
      .populate<{ modules: ModuleDocument[] }>("modules")
      .lean();
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return Course;
  }
  async getUserCourseModules(course: string, user: string) {
    const Course = await courseModel
      .findById(course)
      .populate({
        path: "modules",
        populate: {
          path: "progress",
          match: { user },
        },
      })
      .lean();
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return Course;
  }
  async getCourseStudents(course: string) {
    const Course = await courseModel
      .findById(course)
      .populate<{
        students: CourseProgressDocument[];
        user: UserDocument;
        lastLesson: LessonDocument;
      }>({
        path: "students",
        populate: [
          {
            path: "user",
            select: "name lastname",
          },
          {
            path: "lastLesson",
            select: "module lesson",
            populate: [
              {
                path: "module",
                select: "title",
              },
              {
                path: "lesson",
                select: "title",
              },
            ],
          },
        ],
      })
      .lean();
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return Course;
  }
  async getCourseExercises(course: string) {
    const Course = await courseModel
      .findById(course)
      .populate<{ exercises: LessonDocument[] }>("exercises")
      .lean();
    return Course;
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
    return Module;
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

  async getModule(module: ObjectId | string) {
    const Module = await moduleModel.findById(module);
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    return new ModuleDto(Module);
  }
  async getModuleLessons(module: string) {
    const Module = await moduleModel
      .findById(module)
      .populate<{ lessons: LessonDocument[] }>("lessons")
      .lean();
    if (!Module) {
      throw ApiError.BadRequest("Модуль не найден");
    }
    return Module;
  }
  async getUserModuleLessons(module: string, user: string) {
    const Module = await moduleModel
      .findById(module)
      .populate({
        path: "lessons",
        populate: {
          path: "progress",
          match: { user },
        },
      })
      .lean();
    if (!Module) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return Module;
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
    return Lesson;
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
    return Lesson;
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

  async getLesson(lesson: ObjectId | string) {
    const Lesson = await lessonModel.findById(lesson);
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    return Lesson;
  }
  async getLessonContent(lesson: string) {
    const Lesson = await lessonModel
      .findById(lesson)
      .populate("prev")
      .populate("next")
      .lean();
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    return Lesson;
  }
  async getUserLesson(lesson: string, user: string) {
    const Lesson = await lessonModel
      .findById(lesson)
      .populate({
        path: "progress",
        match: { user },
        populate: {
          path: "homework",
          populate: {
            path: "files",
          },
        },
      })
      .lean();
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    return Lesson;
  }
  async getLessonHomeworks(lesson: string) {
    const Lesson = await lessonModel
      .findById(lesson)
      .populate<{ homeworks: HomeworkDocument[] }>("homeworks")
      .lean();
    if (!Lesson) {
      throw ApiError.BadRequest("Урок не найден");
    }
    return Lesson;
  }
}
export default new courseService();
