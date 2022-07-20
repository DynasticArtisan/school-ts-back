const ApiError = require("../exceptions/ApiError");
const roles = require("../utils/roles");

const userService = require("../services/userService")
const coursesService = require("../services/coursesService");

class UserController {
    async getUsers(req, res, next){
        try {
            const { role } = req.user;
            if(role === roles.super || role === roles.admin){
                const Users = await userService.getUsers()
                res.json(Users)
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
                const Courses = await coursesService.getUserCourses(id)
                res.json({ ...User, courses: Courses })
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
                if(!roles.values().includes(newRole)){
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
                // удалить прогресс
                // удалить уведомления
                // удалить токены
                // удалить домашние задания
                // удалить файлы
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