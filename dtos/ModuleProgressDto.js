class ModuleProgressDto {
    constructor(model){
        this.id = model._id
        this.user = model.user
        this.module = model.module
        this.course = model.course
        this.isAvailable = model.isAvailable
        this.isCompleted = model.isCompleted
    }
}
module.exports = ModuleProgressDto