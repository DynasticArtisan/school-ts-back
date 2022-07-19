class ExerciseDto {
  constructor(model){
      this.id = model._id
      this.task = model.task
      if(model.lesson.title){
        this.lesson = model.lesson.title
      }
      if(model.module.title){
        this.module = model.module.title
      }
  }
}
module.exports = ExerciseDto