class HomeworkDto { 
  constructor(model){
      this.id = model._id
      this.status = model.status
      this.comment = model.comment
      this.user = model.user
      if(model.user.surname && model.user.name){
          this.username = model.user.surname + " " + model.user.name
      }
      if(model.files){
          this.files = model.files
      }
      //this.lesson = model.lesson
      //this.exercise = model.exercise
  }
}

module.exports = HomeworkDto