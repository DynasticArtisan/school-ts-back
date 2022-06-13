const courseModel = require("../models/courseModel")

const ApiError = require("../exceptions/ApiError")
const { AdminCoursesProgressDto, AdminSingleCourseDto } = require("../dtos/progressDtos")

class CoursesService {
    async createCourse( payload ){
      const Course = await courseModel.create(payload)
      return Course
    }
    async getAllCourses(){
      const Courses = await courseModel.find().lean().populate('totalLessons')
      return Courses
    }
    async getCourse(courseId){
      const Course = await courseModel.findById(courseId)
      return Course
    }
    async updateCourse(courseId, data){
      const Course = await courseModel.findByIdAndUpdate(courseId, data, {new: true})
      return Course
    }
    async deleteCourse(courseId){
      const Course = await courseModel.findByIdAndRemove(courseId)
      return Course
    }
    async dropAllCourses(){
      const Courses = await courseModel.deleteMany()
      return Courses
    }

    // superadmin -> homework courses page
    async getAllCoursesData(){
      const AllCourses = await courseModel.find().select('title subtitle')
      const AllCoursesData = AllCourses.map(item => new AdminCoursesProgressDto(item))
      return AllCoursesData
    }
    async getTotalProgresses(){
      const Courses = await courseModel.find().select('title subtitle').populate("totalCompleted").populate("totalInProgress").lean()
      const CoursesData = Courses.map(item => new AdminCoursesProgressDto(item))
      return CoursesData;
    }
    async getSingleCourseData(courseId){
      const Course = await courseModel.findById(courseId).populate({
          path: 'modules'
      }).lean()
      const CourseData = new AdminSingleCourseDto(Course)
      return CourseData
    }
    async getOneCourseData(course){
      const OneCourse = await courseModel.findById(course).select('title subtitle')
      const OneCourseData = new AdminCoursesProgressDto(OneCourse)
      return OneCourseData
    }






    // superadmin -> courses page
    async getAllCoursesDataWithStatistics(){
      const AllCourses = await courseModel.find().select('title subtitle').populate("totalCompleted").populate("totalInProgress").lean()
      return AllCourses.map(item => new AdminCoursesProgressDto(item))
    }



    async getCoursesList(){
      const Courses = await courseModel.find().select('title')
      return Courses.map(c => ({id: c._id, title: c.title}))
    }
    async getWholeCoursesProgress(){
      const CoursesData = await courseModel.find().select('title subtitle').populate("totalCompleted").populate("totalInProgress").lean()
      return CoursesData
    }


}

module.exports = new CoursesService()