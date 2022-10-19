import CourseDto from "src/dtos/CourseDto";
import ApiError from "src/exceptions/ApiError";
import courseModel, { CourseInput } from "src/models/courseModel";

class CourseConstructionService {
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
    return Course;
  }
}
export default new CourseConstructionService();
