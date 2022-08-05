const ApiError = require("../exceptions/ApiError");
const roles = require("../utils/roles");

const userService = require("../services/userService")
const coursesService = require("../services/coursesService");
const courseProgressService = require("../services/courseProgressService");
const tokenService = require("../services/tokenService");
const homeworkService = require("../services/homeworkService");
const courseMastersService = require("../services/courseMastersService");

class UserController {
    async getUsers(req, res, next){
        try {
            const { role, id } = req.user;
            if(role === roles.super || role === roles.admin){
                const Users = await userService.getUsers()
                res.json(Users.filter(user => user.id != id))
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getUser(req, res,next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            if(role === roles.super || role === roles.admin){
                const User = await userService.getUser(id)
                if(User.role === roles.user){
                    const Courses = await coursesService.getUserCourses(id)
                    res.json({ user: User, courses: Courses })
                } else if(User.role === roles.teacher || User.role === roles.curator){
                    const Courses = await coursesService.getMasterCourses(id)
                    res.json({ user: User, courses: Courses })
                }
                res.json({user: User, courses: []})
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async getStudent(req, res, next){
        try {
            const { id, course } = req.params;
            const { role } = req.user;
            if(role === roles.super){
                await courseProgressService.getCourseProgress({ user: id, course })
                const User = await userService.getUser(id)
                const Courses = await coursesService.getUserCourses(id)
                res.json({ user: User, courses: Courses })
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async updateProfile(req, res, next){
        try {
            const { id } = req.user;
            const { name, surname, ...settings } = req.body;
            const User = await userService.updateUser(id, { name, surname, settings })
            res.json(User)
        } catch (e) {
            next(e)
        }
    }
    async updatePassword(req, res, next){
        try {
            const { id } = req.user;
            const { password, newPassword } = req.body;
            const User = userService.replacePassword(id, password, newPassword )
            res.json(User)
        } catch (e) {
            next(e)
        }
    }
    async changeRole(req, res, next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            if(role === roles.super){
                const newRole = req.body.role;
                if(!Object.values(roles).includes(newRole)){
                    next(ApiError.BadRequest("Некорректная роль"))
                }
                const User = await userService.updateUser(id, { role: newRole })
                res.json(User)
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }
    async deleteUser(req, res, next){
        try {
            const { id } = req.params;
            const { role } = req.user;
            if(role === roles.super){
                await userService.deleteUser(id)
                await tokenService.deleteUserToken(id)
                await courseProgressService.deleteUserProgress(id)

                await courseMastersService.deleteUserMasterings(id)
                await homeworkService.deleteUserHomeworks(id)
                // удалить прогресс + 
                // удалить уведомления
                // удалить токены +
                // удалить домашние задания +
                // удалить файлы +
                res.json("Пользователь был удален");
            } else {
                next(ApiError.Forbidden())
            }
        } catch (e) {
            next(e)
        }
    }

}
module.exports = new UserController()