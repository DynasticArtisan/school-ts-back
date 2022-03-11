const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/ApiError');

module.exports = function(req){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw ApiError.BadRequest('Ошибка при валидации', errors);
    }
}
