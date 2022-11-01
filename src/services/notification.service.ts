import { ObjectId } from "mongoose";
import ApiError from "../exceptions/ApiError";
import { CourseDocument } from "../models/course.model";
import { LessonDocument } from "../models/lesson.model";
import notificationsModel from "../models/notifications.model";
import { NotifTemplateTypes } from "../models/notifTemplates.model";
import { UserDocument } from "../models/user.model";
import notifTemplateService from "./notifTemplate.service.ts";
import userService from "./user.service";

class NotifService {
  async createCustomNotif(template: string, user: string) {
    const Template = await notifTemplateService.getTemplate(template);
    const User = await userService.getUser(user);
    const Notification = await notificationsModel.create({
      user: User._id,
      ...Template.prepare({ user: User }),
    });
    if (!Notification) {
      throw ApiError.BadRequest("Не удалось отправить уведомление");
    }
    return Notification;
  }
  async createManyCustomNotif(template: string, users: string[]) {
    const Template = await notifTemplateService.getTemplate(template);
    const Users = await userService.getUsersArray(users);
    const Notifications = await notificationsModel.create(
      Users.map((user) => ({ user: user._id, ...Template.prepare({ user }) }))
    );
    if (!Notifications) {
      throw ApiError.BadRequest("Не удалось отправить уведомления");
    }
    return Notifications;
  }

  async createNewUserNotifs(
    user: ObjectId | string,
    UserDocument: UserDocument
  ) {
    const Templates = await notifTemplateService.getManySpecialTemplates(
      NotifTemplateTypes.newUser
    );
    const Notifications = await notificationsModel.create(
      Templates.map((template) => ({
        user,
        ...template.prepare({ user: UserDocument }),
      }))
    );
    return Notifications;
  }
  async createHomeworkRejectNotif(user: string, lesson: LessonDocument) {
    const Template = await notifTemplateService.getSpecialTemplate(
      NotifTemplateTypes.homeworkReject
    );
    return await notificationsModel.create({
      user,
      ...Template.prepare({ lesson }),
    });
  }
  async createHomeworkAcceptNotif(user: string, lesson: LessonDocument) {
    const Template = await notifTemplateService.getSpecialTemplate(
      NotifTemplateTypes.homeworkAccept
    );
    return await notificationsModel.create({
      user,
      ...Template.prepare({ lesson }),
    });
  }
  async createCourseLockNotif(user: string, course: CourseDocument) {
    const Template = await notifTemplateService.getSpecialTemplate(
      NotifTemplateTypes.courseLock
    );
    return await notificationsModel.create({
      user,
      ...Template.prepare({ course }),
    });
  }
  async createCourseUnlockNotif(user: string, course: CourseDocument) {
    const Template = await notifTemplateService.getSpecialTemplate(
      NotifTemplateTypes.courseLock
    );
    return await notificationsModel.create({
      user,
      ...Template.prepare({ course }),
    });
  }

  async checkNewNotifs(user: string) {
    return await notificationsModel.find({ user, readed: false }).count();
  }
  async getUserNotifs(user: string) {
    const Notifications = await notificationsModel
      .find({ user })
      .sort("-createdAt");
    await notificationsModel.updateMany(
      { user, readed: false },
      { readed: true }
    );
    return Notifications;
  }

  async deleteNotif(id: string) {
    return await notificationsModel.findByIdAndDelete(id);
  }
}

export default new NotifService();
