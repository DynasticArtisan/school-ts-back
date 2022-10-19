module.exports = class UserTokenDto {
    id;
    role;
    isActivated;
    constructor(model){
        this.id = model._id;
        this.role = model.role;
        this.isActivated = model.isActivated;
    }
}