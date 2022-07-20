class CourseMasterDto {
    constructor(model){
        this.id = model.id
        if (model.verifiedHomeworksCount){
            this.verifiedHomeworksCount = model.verifiedHomeworksCount
        }
    }
}
module.exports = CourseMasterDto