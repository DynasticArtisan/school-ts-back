const { validationResult, checkSchema } = require('express-validator');
const ApiError = require('../exceptions/ApiError');

class Validator {
    validate(validations) {
        return async (req, res, next) => {
            await Promise.all(validations.map(validation => validation.run(req)));
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                next(ApiError.BadRequest("Ошибка при валидации", errors));
            }
            return next()
        };
    }

    #isCyrillic = {
        options: value => {
            const reg = /^[а-яА-Я]+$/;
            if(!reg.test(value)){
                throw Error('Доступна только кириллица')
            }
            return value
        }
    }
    #isPassword = {
        options: value => {
            const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            if(!reg.test(value)){
                throw Error('Пароль должен состоять минимум из 8 символов, включать верхний регистр, нижний регистр и цифру')
            }
            return value;
        }
    }
    validateRegistrationData = this.validate(checkSchema({
        name: {
            notEmpty: { 
                bail:true,
                errorMessage: 'Поле не может быть пустым'
            },
            isLength: {
                options: { min: 2 },
                errorMessage: 'Имя не может состоять из одной буквы',
                bail: true
            },
            custom: this.#isCyrillic
        },
        surname: {
            notEmpty: { 
                bail: true,
                errorMessage: 'Поле не может быть пустым'
            },
            isLength: {
                options: { min: 2 },
                errorMessage: 'Фамилия не может состоять из одной буквы',
                bail: true
            },
            custom: this.#isCyrillic

        },
        email: {
            notEmpty: { 
                bail: true,
                errorMessage: 'Поле не может быть пустым'
            },
            isEmail: { 
                bail: true,
                errorMessage: 'Некорректный эмейл'
            },
            normalizeEmail: true
        },
        password: {
            notEmpty: { 
                bail: true,
                errorMessage: 'Поле не может быть пустым'
            },
            custom: this.#isPassword
        }
    }))
    validateResetPassword = this.validate(checkSchema({
        newPassword: {
            notEmpty: { 
                bail: true,
                errorMessage: 'Поле не может быть пустым'
            },
            custom: this.#isPassword
        },
        id: {
            notEmpty: { 
                bail: true,
                errorMessage: 'Поле не может быть пустым'
            } 
        }
    }))

}


module.exports = new Validator();
