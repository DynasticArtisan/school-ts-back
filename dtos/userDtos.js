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

class UserListDto {
    constructor(model){
        this.id = model._id,
        this.fullname = model.surname + ' ' + model.name;
        this.email = model.email;
        switch (model.role){
            case "user":
                this.role = "Пользователь"
                break;
            case "admin":
                this.role = "Администратор"
                break;
            case "super":
                this.role = "Супер администратор"
                break;
            case "teacher":
                this.role = "Преподаватель"
                break;
            case "curator":
                this.role = "Куратор"
                break;
            default :
                break
        }
        this.registryAt = model.createdAt;
    }
}
class SingleUserDto {
    constructor(model){
        this.id = model._id
        this.name = model.name
        this.surname = model.surname
        this.email = model.email
        this.avatar = model.avatar
        this.phone = model.info.phone
        this.city = model.info.city
        this.birthday = model.info.birthday
        this.gender = model.info.gender
        this.status = model.info.status
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
    UserInfoDto, UserTokenDto, UserListDto, SingleUserDto
}