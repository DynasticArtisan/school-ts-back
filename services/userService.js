const ApiError = require("../exceptions/ApiError");
const UserTokenDto = require('../dtos/UserTokenDto');
const UserDto = require('../dtos/userDto');
const config = require("config");
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const mailService = require("./mailService");
const tokenService = require("./tokenService");
const userModel = require("../models/userModel");


class UserService {
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
        const User = await userModel.findById( userData.id );
        if(!User){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        const tokens = await tokenService.generateTokens({...new UserTokenDto(User)});
        await tokenService.saveToken(User.id, tokens.refreshToken);
        return { ...tokens, user: new UserDto(User) }
    }
    async registration({ name, surname, email, password }){
        const PrevUser = await userModel.findOne({ email })
        if(PrevUser){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activateLink = uuid.v4();
        const User = await userModel.create({ activateLink, name, surname, email, password: hashPassword })
        console.log(`${config.get("APIURL")}/api/auth/activate/${activateLink}`)
        await mailService.sendActivationMail(email, `${config.get("APIURL")}/api/auth/activate/${activateLink}`, name);
        return new UserDto(User)
    }
    async login(email, password){
        const User = await userModel.findOne({ email });
        if(!User){
            throw ApiError.BadRequest('Пользователь не найден');
        }
        const isPassEquals = await bcrypt.compare(password, User.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Некорректный пароль');
        }
        const TokenDto = new UserTokenDto(User)
        const tokens = await tokenService.generateTokens({...TokenDto})
        await tokenService.saveToken(User.id, tokens.refreshToken);
        return { ...tokens, user: new UserDto(User) }
    }
    async activate(activateLink) {
        const User = await userModel.findOneAndUpdate({ activateLink }, { activateLink: null, isActivated: true });
        if(!User){
            throw ApiError.BadRequest('Некорректная ссылка для активации');
        }
        return new UserDto(User)
    }
    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }


    async getUsers(){
        const Users = await userModel.find().select('-settings')
        return Users.map(user => new UserDto(user))
    }
    async getUser(id){
        const User = await userModel.findById(id)
        if(!User){
            throw ApiError.BadRequest("Пользователь не найден")
        }
        return new UserDto(User)
    }
    async updateUser(id, payload) {
        const User = await userModel.findByIdAndUpdate(id, payload, { new: true });
        if(!User){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return new UserDto(User)
    }
    async replacePassword(id, password, newPassword){
        const User = await userModel.findById(id);
        const isPassEquals = await bcrypt.compare(password, User.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Неверный пароль');
        }
        const hashPassword = await bcrypt.hash(newPassword, 3);
        User.password = hashPassword;
        await User.save();
        return new UserDto(User);
    }
    async updatePassword(id, password){
        const hashPassword = await bcrypt.hash(password, 3);
        const User = await userModel.findByIdAndUpdate(id, { password: hashPassword });
        if(!User){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return User
    }
    async deleteUser(id) {
        const User = await userModel.findByIdAndDelete(id);
        if(!User){
            throw ApiError.BadRequest('Пользователь не найден')
        }
        return User
    }


    async forgotPassword(email){
        const User = await userModel.findOne({ email, isActivated: true });
        if(User){
            const token = await tokenService.generateResetToken({ id: User.id, email: User.email }, User.password);
            // await mailService.sendResetPasswordLink(email, `${config.get("APIURL")}/api/auth/reset-password/${User.id}/${token}`);
            console.log(`${config.get("APIURL")}/api/auth/reset-password/${User.id}/${token}`);
        }
        return true
    }
    async getResetToken(id, token){
        const User = await userModel.findById(id);
        if(!User){
            throw ApiError.BadRequest('Пользователь не был найден'); //redirect to homepage
        }
        const tokenData = await tokenService.validateResetToken(token, User.password);
        if(!tokenData){
            throw ApiError.UnauthorizedError(); //redirect to homepage
        }
        const resetToken = await tokenService.generateResetToken({...new UserTokenDto(User)}, User.password);
        return resetToken;
    }
    async resetPassword(id, token, password){
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







}

module.exports = new UserService()