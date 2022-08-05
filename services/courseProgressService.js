const ApiError = require("../exceptions/ApiError");
const CourseProgressDto = require("../dtos/CourseProgressDto");
const ModuleProgressDto = require("../dtos/ModuleProgressDto");
const LessonProgressDto = require("../dtos/LessonProgressDto");

const courseProgressModel = require("../models/UCProgressModel");
const moduleProgressModel = require("../models/UMProgressModel");
const lessonProgressModel = require("../models/ULProgressModel");

class CourseProgressService {
    async getCourseStudents(course){
        const Progresses = await courseProgressModel.find({ course }).populate([
            {
                path: 'user',
                select: 'name surname'
            },
            {
                path: 'lastLesson',
                populate: 'lesson module'
            }
        ]).lean()
        return Progresses.map(progress => new CourseProgressDto(progress))
    }

    async createCourseProgress({ user, course, format }) {
        const PrevProgress = await courseProgressModel.findOne({ user, course })
        if(PrevProgress){
            throw ApiError.BadRequest("Курс уже доступен пользователю")
        }
        const Progress = await courseProgressModel.create({ user, course, format, endAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
        return new CourseProgressDto(Progress)

        //const FirstModule = await modulesService.getFirstModule(course)
        //await CourseProgressService.createModuleProgress({ user, course, module: FirstModule.id }) 
    }

    async createModuleProgress({ user, module, course, prevModule }){
        // ВОЗВРАЩАЕМ ПРОГРЕСС, ЕСЛИ ЕСТЬ
        const PrevProgress = await moduleProgressModel.findOne({ user, module })
        if(PrevProgress){
            return new ModuleProgressDto(PrevProgress)
        }
        // ПРОВЕРЯЕМ, ПРОЙДЕН ЛИ ПРЕДЫДЩИЙ МОДУЛЬ
        if(prevModule){
            const PrevModelCompleted = await moduleProgressModel.findOne({ user, module: prevModule, isCompleted: true })
            if(!PrevModelCompleted){
                throw ApiError.Forbidden()
            }
        }
        // СОЗДАЕМ НОВЫЙ ПРОГРЕСС
        const Progress = await moduleProgressModel.create({ user, module, course })
        return new ModuleProgressDto(Progress)
    }

    async createLessonProgress({ user, lesson, module, course, prevLesson }) {
        // ВОЗВРАЩАЕМ ПРОГРЕСС, ЕСЛИ ЕСТЬ
        const PrevProgress = await lessonProgressModel.findOne({ user, lesson })
        if(PrevProgress){
            return new LessonProgressDto(PrevProgress)
        }
        // ПРОВЕРЯЕМ, ПРОЙДЕН ЛИ ПРЕДЫДЩИЙ УРОК
        if(prevLesson){
            const PrevLessonCompleted = await lessonProgressModel.findOne({ user, lesson: prevLesson, isCompleted: true })
            if(!PrevLessonCompleted){
                throw ApiError.Forbidden()
            }
        }
        // СОЗДАЕМ НОВЫЙ ПРОГРЕСС
        const Progress = await lessonProgressModel.create({ user, lesson, module, course });
        return new LessonProgressDto(Progress)

    }


    async updateCourseProgress(id, payload){
        const Progress = await courseProgressModel.findByIdAndUpdate(id, payload, { new: true })
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new CourseProgressDto(Progress)
    }




    async getCourseProgress({ user, course }){
        const Progress = await courseProgressModel.findOne({ user, course })
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new CourseProgressDto(Progress)
    }

    async getModuleProgress({ user, module }){
        const Progress = await moduleProgressModel.findOne({ user, module })
        if(!Progress){
            throw ApiError.BadRequest("Прогресс пользователя не найден")
        }
        return new ModuleProgressDto(Progress)
    }

    async getLessonProgress({ user, lesson }){
        const Progress = await lessonProgressModel.findOne({ user, lesson }).populate({
            path: 'homework',
            populate: 'files'
        }).lean()
        if(!Progress){
            throw ApiError.BadRequest("Прогресс пользователя не найден")
        }
        return new LessonProgressDto(Progress)
    }

    async completeCourseProgress({ user, course }){
        const Progress = await courseProgressModel.findOneAndUpdate({ course, user }, { isCompleted: true }, { new: true })
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        return new CourseProgressDto(Progress)
    }

    async completeModuleProgress({ user, module }){
        const Progress = await moduleProgressModel.findOneAndUpdate({ user, module }, { isCompleted: true }, { new: true }).populate({
            path: "module",
            populate: "nextModule"
        }).lean()
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        if(!Progress.module.nextModule){
            await this.completeCourseProgress({ user, course: Progress.course })
        }
        return new ModuleProgressDto(Progress)
    }

    async completeLessonProgress({ user, lesson }){
        const Progress = await lessonProgressModel.findOneAndUpdate({ user, lesson }, { isCompleted: true }, { new: true }).populate({
            path: 'lesson',
            populate: 'nextLesson'
        }).lean();
        if(!Progress){
            throw ApiError.BadRequest('Прогресс пользователя не найден')
        }
        if(!Progress.lesson.nextLesson){
            await this.completeModuleProgress({ user, module: Progress.module })
        }
        return new LessonProgressDto(Progress)
    }


    async deleteUserProgress(user){
        await courseProgressModel.deleteMany({ user })
    }

}
module.exports = new CourseProgressService()