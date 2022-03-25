module.exports = class AuthDto {
    id;
    name;
    surname;
    role;
    isActivated;
    avatar;
    constructor(model){
        this.id = model._id;
        this.name = model.name;
        this.surname = model.surname;
        this.role = model.role;
        this.isActivated = model.isActivated;
        this.avatar = model.avatar;
    }
}