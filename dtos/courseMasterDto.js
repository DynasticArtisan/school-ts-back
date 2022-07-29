class CourseMasterDto {
    constructor(model){
        this.id = model.id
        this.isAvailable = model.isAvailable
        this.verifiedHomeworksCount = model.verifiedHomeworksCount

    }
}
module.exports = CourseMasterDto