const userService = require("../services/userService");

class SuperController {
    async setRole(req, res, next){
        try {
            const { userId, role } = req.body;
            const userData = await userService.setUserRole( userId, role );
            res.json(userData);
        } catch (e) {
            next(e)
        } 
    }


    async deleteUser(req, res, next){
        try {
            const { id } = req.body;
            const userData = await userService.deleteUser( id );
            res.json(userData)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new SuperController()