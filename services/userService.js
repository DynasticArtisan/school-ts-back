const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require("config");

const mailService = require("./mailService");
const tokenService = require("./tokenService");
const userModel = require("../models/userModel");
const UserDto = require('../dtos/userDto');
const AuthDto = require('../dtos/authDto');
const UserTokenDto = require('../dtos/userTokenDto');
const ApiError = require("../exceptions/ApiError");
const fileService = require('./fileService');
const { UserInfoDto, UserListDto } = require('../dtos/userDtos');

const Roles = [ 'teacher', 'curator', 'user' ];

class UserService {
    async createUser(payload) {
        const User = await userModel.create(payload);
        return User
    }
    async getAllUsers() {
        const Users = await userModel.find()
        return Users
    }
    async getOneUser(userId) {
        const User = await userModel.findById(userId);
        if(!User){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return User
    }
    async updateUser(userId, payload) {
        const User = await userModel.findByIdAndUpdate(userId, payload, { new: true });
        if(!User){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return User
    }
    async deleteUser(userId) {
        const User = await userModel.findByIdAndDelete(userId);
        if(!User){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return User
    }


    async registration (name, surname, email, password) {
        const candidate = await userModel.findOne({ email });
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activateLink = uuid.v4();
        const user = await userModel.create({ email, password: hashPassword, activateLink, name, surname });
        // await mailService.sendActivationMail(email, `${config.get("APIURL")}/api/auth/activate/${activateLink}`);
        console.log(`${config.get("APIURL")}/api/auth/activate/${activateLink}`)
        const userDataDto = new UserInfoDto(user);
        const userTokenDto = new UserTokenDto(user);
        const tokens = await tokenService.generateTokens({...userTokenDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDataDto }
    }
    async activate (activateLink) {
        const user = await userModel.findOne({ activateLink });
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка для активации');
        }
        user.isActivated = true;
        await user.save();
    }
    async login(email, password){
        const user = await userModel.findOne({ email });
        if(!user){
            throw ApiError.BadRequest('Пользователь не был найден');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Некорректный пароль');
        }
        const userDataDto = new UserInfoDto(user);
        const userTokenDto = new UserTokenDto(user);
        const tokens = await tokenService.generateTokens({...userTokenDto});
        await tokenService.saveToken(userDataDto.id, tokens.refreshToken);
        return { ...tokens, user: userDataDto }
    }
    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async forgotPassword(email){
        const user = await userModel.findOne({ email });
        if(user){
            const token = await tokenService.generateResetToken({ id:user.id, email:user.email }, user.password);
            // await mailService.sendResetPasswordLink(email, `${config.get("APIURL")}/api/auth/reset-password/${user.id}/${token}`);
            console.log(`${config.get("APIURL")}/api/auth/reset-password/${user.id}/${token}`);
        }
    }
    async getResetToken(id, token){
        const user = await userModel.findById(id);
        if(!user){
            throw ApiError.BadRequest('Пользователь не был найден'); //redirect to homepage
        }
        const tokenData = await tokenService.validateResetToken(token, user.password);
        if(!tokenData){
            throw ApiError.UnauthorizedError(); //redirect to homepage
        }
        const userTokenDto = new UserTokenDto(user);
        const resetToken = await tokenService.generateResetToken({...userTokenDto}, user.password);
        return resetToken;
    }
    async passwordReset(id, token, password){
        const user = await userModel.findById(id);
        if(!user){
            throw ApiError.BadRequest('Пользователь не найден');
        }
        const tokenData = await tokenService.validateResetToken(token, user.password);
        if(!tokenData){
            throw ApiError.UnauthorizedError();
        }
        const hashPassword = await bcrypt.hash(password, 3);
        user.password = hashPassword;
        await user.save();
        return new UserDto(user);
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.BadRequest('Невалидный токен');
        }
        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if(!userData ){
            throw ApiError.BadRequest('Невалидный токен');
        }
        if(!tokenFromDB){
            throw ApiError.BadRequest('Невалидный токен');
        }
        const user = await userModel.findById( userData.id );

        const userDataDto = new UserInfoDto(user);
        const userTokenDto = new UserTokenDto(user);

        const tokens = await tokenService.generateTokens({...userTokenDto});
        await tokenService.saveToken(userDataDto.id, tokens.refreshToken);
        return { ...tokens, user: userDataDto }
    }
    async changeRole(id, role){
        const roles = [ 'user', 'curator', 'teacher' ]
        const user = await userModel.findById(id)
        if( !roles.includes(role) ){
            throw ApiError.BadRequest('Некорректная роль');
        }
        if(!user){
            throw ApiError.BadRequest('Пользователь не найден');
        }
        user.role = role;
        await user.save();
        const userData = new UserDto(user);
        return userData;
    }



    // change-users-information
    async updateUserInfo(id, data){
        const user = await userModel.findById(id);
        if(!user){
            throw ApiError.BadRequest('Некорректный пользователь' );
        }
        if(data.name){
            user.name = data.name;
        }
        if(data.surname){
            user.surname = data.surname;
        }
        if(data.birthday){
            user.info.birthday = data.birthday;
        }
        if(data.phone){
            user.info.phone = data.phone;
        }
        if(data.city){
            user.info.city = data.city;
        }
        if(data.male){
            user.info.male = data.male;
        }
        if(data.status){
            user.info.status = data.status;
        }

        await user.save();
        const userData = new UserDto(user);
        return userData;
    }
    async uploadUserAvatar(id, avatar){
        const user = await userModel.findById(id);
        if(!user){
            throw ApiError.BadRequest('Пользователь не найден');
        }
        if(user.avatar){
            await fileService.removeAvatar(user.avatar) 
        }
        user.avatar = avatar;
        await user.save();
        return new UserDto(user);
    }
    async removeUserAvatar(id){
        const user = await userModel.findById(id);
        if(!user){
            throw ApiError.BadRequest('Пользователь не найден');
        }
        if(!user.avatar){
            throw ApiError.BadRequest('Файл не найден');
        }
        await fileService.removeAvatar(user.avatar)
        user.avatar = null;
        await user.save();
        return new UserDto(user);
    }
    async changePassword(userId, password, newPassword){
        const user = await userModel.findById(userId);
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Некорректный пароль');
        }
        const hashPassword = await bcrypt.hash(newPassword, 3);
        user.password = hashPassword;
        await user.save();
        const userData = new UserDto(user);
        return userData;
    }
    async updateNotificationSettings( id, courseNotif, lessonsNotif, actionsNotif ){
        const user = await userModel.findById(id);
        if(!user){
            throw ApiError.BadRequest('Пользователь не найден');
        }
        user.settings.notifications.courseNotif = courseNotif;
        user.settings.notifications.lessonsNotif = lessonsNotif;
        user.settings.notifications.actionsNotif = actionsNotif;
        await user.save();
        return new UserDto(user);
    }

    async setUserRole(userId, role){
        const user = await userModel.findById(userId);
        if(!user){
            throw ApiError.BadRequest('Некорректный пользователь' );
        }
        if(user.role == role){
            throw ApiError.BadRequest('Некорректный запрос');
        }
        if(!Roles.includes(role)){
            throw ApiError.BadRequest('Некорректный запрос');
        }
        user.role = role;
        await user.save();
        return new UserDto(user);
    }



    async getUsersList(){
        const Users = await userModel.find({ isActivated: true }).select('name surname email role createdAt')
        const UsersData = Users.map(user => new UserListDto(user))
        return UsersData
    }




}

module.exports = new UserService()