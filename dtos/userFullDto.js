module.exports = class UserFullDto {
    id;
    name;
    surname;
    email;
    birthday;
    phone;
    city;
    male;
    status;
    avatar;
    role;


    constructor(model){
        this.id = model._id;
        this.name = model.name;
        this.surname = model.surname;
        this.email = model.email;
        this.birthday = model.birthday;
        this.phone = model.phone
        this.city = model.city
        this.male = model.male
        this.status = model.status
        this.avatar = model.avatar
        this.role = model.role
    }

}