class HomeworkDto { 
  constructor(model){
      this.id = model._id
      this.status = model.status
      this.comment = model.comment
      this.files = model.files
      if(model.lesson){
        this.lesson = model.lesson
      }
      if(model.course){
        this.course = model.course
      }
      if(model.user.surname && model.user.name){
        this.user = { name: model.user.name, surname: model.user.surname }
      } else {
        this.user = model.user
      }


  }
}

module.exports = HomeworkDto