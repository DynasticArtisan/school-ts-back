module.exports = (string, { course, lesson }) => {
    if(course){
        string = string.replace('#course-title#', course.title)
    }
    if(lesson){
        string = string.replace('#lesson-title#', lesson.title + ' - ' + lesson.description)
    }
    return string
}

