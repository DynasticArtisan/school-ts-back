module.exports = class UserDto {
    id;
    name;
    surname;
    email;
    role;
    isActivated;
    info;
    settings;
    constructor(model){
        this.id = model._id;
        this.name = model.name;
        this.surname = model.surname;
        this.email = model.email;
        this.role = model.role;
        this.isActivated = model.isActivated;
        this.info = model.info;
        this.settings = model.settings;
    }
}