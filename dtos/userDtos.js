class UserInfoDto {
    constructor(model){
        this.name = model.name;
        this.surname = model.surname;
        this.email = model.email;
        this.role = model.role;
        this.isActivated = model.isActivated;
        this.info = model.info;
        this.avatar = model.avatar;
        this.settings = model.settings;
    }
}

class UserTokenDto {
    constructor(model){
        this.id = model._id;
        this.role = model.role;
        this.isActivated = model.isActivated;
    }
}

module.exports = {
    UserInfoDto, UserTokenDto
}