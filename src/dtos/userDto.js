module.exports = class UserDto {
    constructor(model){
        this.id = model._id;
        this.name = model.name;
        this.surname = model.surname;
        this.email = model.email;
        this.role = model.role;
        this.isActivated = model.isActivated;
        if(model.settings){
            this.settings = model.settings
        }
        this.registryAt = model.createdAt;
    }
}