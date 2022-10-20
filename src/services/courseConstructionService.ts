import CourseDto from "src/dtos/CourseDto";
import LessonDto from "src/dtos/LessonDto";
import ModuleDto from "src/dtos/ModuleDto";
import ApiError from "src/exceptions/ApiError";
import courseModel, { CourseInput } from "src/models/courseModel";
import lessonModel, { LessonDocument } from "src/models/lessonModel";
import moduleModel, { ModuleDocument } from "src/models/moduleModel";

class CourseConstructionService {
  async getCourse(course: string) {
    const Course = await courseModel.findById(course);
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return new CourseDto(Course);
  }

  async createCourse(courseData: CourseInput) {
    const Course = await courseModel.create(courseData);
    return new CourseDto(Course);
  }

  async updateCourse(id: string, courseData: CourseInput) {
    const Course = await courseModel.findByIdAndUpdate(id, courseData, {
      new: true,
    });
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return new CourseDto(Course);
  }

  async deleteCourse(id: string) {
    const Course = await courseModel.findByIdAndDelete(id);
    if (!Course) {
      throw ApiError.BadRequest("Курс не найден");
    }
    await moduleModel.deleteMany({ course: id });
    await lessonModel.deleteMany({ course: id });
    return Course;
  }

  async getModule(module: string) {
    const Module = await moduleModel.findById(module);
    if (!Module) {
      throw ApiError.BadRequest("Курс не найден");
    }
    return new ModuleDto(Module);
  }

  async createModule(course: string, title: string, description: string) {
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

  async updateModule(id: string, title: string, description: string) {
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

  async deleteModule(id: string) {
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
  async deleteLesson(id: string) {
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
export default new CourseConstructionService();
