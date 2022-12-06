import NoteTemplatesService from "./noteTemplates.service.ts";
import UserService from "./user.service";
import NoteModel from "../models/notifications.model";
import { NoteTemplateTypes } from "../models/notifTemplates.model";
import { CourseDocument } from "../models/course.model";
import { LessonDocument } from "../models/lesson.model";
import { UserDocument } from "../models/user.model";
import ApiError from "../exceptions/ApiError";

class NotifService {
  async createNewUserNotes(user: string, UserDocument: UserDocument) {
    const Templates = await NoteTemplatesService.getSpecialTemplates(
      NoteTemplateTypes.newUser
    );
    const Notes = await NoteModel.create(
      Templates.map((template) => ({
        user,
        ...template.prepare({ user: UserDocument }),
      }))
    );
    return Notes;
  }

  async createHomeworkRejectNote(
    userId: string,
    LessonDocument: LessonDocument
  ) {
    const Template = await NoteTemplatesService.getSpecialTemplate(
      NoteTemplateTypes.homeworkReject
    );
    return await NoteModel.create({
      user: userId,
      ...Template.prepare({ lesson: LessonDocument }),
    });
  }

  async createHomeworkAcceptNote(
    userId: string,
    LessonDocument: LessonDocument
  ) {
    const Template = await NoteTemplatesService.getSpecialTemplate(
      NoteTemplateTypes.homeworkAccept
    );
    return await NoteModel.create({
      user: userId,
      ...Template.prepare({ lesson: LessonDocument }),
    });
  }

  async createCourseLockNote(userId: string, course: CourseDocument) {
    const Template = await NoteTemplatesService.getSpecialTemplate(
      NoteTemplateTypes.courseLock
    );
    return await NoteModel.create({
      user: userId,
      ...Template.prepare({ course }),
    });
  }

  async createCourseUnlockNote(userId: string, course: CourseDocument) {
    const Template = await NoteTemplatesService.getSpecialTemplate(
      NoteTemplateTypes.courseUnlock
    );
    return await NoteModel.create({
      user: userId,
      ...Template.prepare({ course }),
    });
  }

  async createCustomNotes(template: string, users: string[]) {
    const Users = await UserService.getUsersArray(users);
    const Template = await NoteTemplatesService.getTemplate(template);

    const Notes = await NoteModel.create(
      Users.map((user) => ({ user: user._id, ...Template.prepare({ user }) }))
    );
    if (!Notes) {
      throw ApiError.BadRequest("Не удалось создать уведомления");
    }
    return Notes;
  }

  async checkNotes(user: string) {
    return await NoteModel.find({ user, readed: false }).count();
  }

  async getUserNotes(user: string) {
    const Notes = await NoteModel.find({ user }).sort("-createdAt");
    await NoteModel.updateMany({ user, readed: false }, { readed: true });
    return Notes;
  }

  async deleteUserNote(noteId: string, user: string) {
    const Note = await NoteModel.findOneAndDelete({
      _id: noteId,
      user,
    });
    if (!Note) {
      throw ApiError.BadRequest("Уведомление не найдено");
    }
    return true;
  }
}

export default new NotifService();
