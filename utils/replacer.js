module.exports = (string, { course, lesson, user }) => {
    if(course){
        string = string.replace('#course-title#', course.title)
    }
    if(lesson){
        string = string.replace('#lesson-title#', lesson.title + ' - ' + lesson.description)
    }
    if(user){
        string = string.replace('#user-name#', user.name)

    }
    return string
}

