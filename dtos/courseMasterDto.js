class CourseMasterDto {
    constructor(model){
        this.id = model.id
        this.isAvailable = model.isAvailable
        if (model.verifiedHomeworksCount){
            this.verifiedHomeworksCount = model.verifiedHomeworksCount
        }
    }
}
module.exports = CourseMasterDto