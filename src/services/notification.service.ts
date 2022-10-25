import { ObjectId } from "mongoose";
import ApiError from "../exceptions/ApiError";
import { CourseDocument } from "../models/course.model";
import { LessonDocument } from "../models/lesson.model";
import notificationsModel from "../models/notifications.model";
import { NotifTemplateTypes } from "../models/notifTemplates.model";
import { UserDocument } from "../models/user.model";
import notifTemplateService from "./notifTemplate.service.ts";

class NotifService {
  async createCustomNotif(
    template: ObjectId | string,
    user: ObjectId | string
  ) {
    const { title, image, icon, body } = await notifTemplateService.getTemplate(
      template
    );
    const Notification = await notificationsModel.create({
      user,
      title,
      image,
      icon,
      body,
    });
    if (!Notification) {
      throw ApiError.BadRequest("Не удалось отправить уведомление");
    }
    return Notification;
  }
  async createManyCustomNotif(
    template: ObjectId | string,
    users: ObjectId[] | string[]
  ) {
    const { title, image, icon, body } = await notifTemplateService.getTemplate(
      template
    );
    const Notifications = await notificationsModel.create(
      users.map((user) => ({ user, title, image, icon, body }))
    );
    if (!Notifications) {
      throw ApiError.BadRequest("Не удалось отправить уведомления");
    }
    return Notifications;
  }
  //   #########################################################
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

  async checkNewUserNotifs(user: ObjectId | string) {
    return await notificationsModel.find({ user, readed: false }).count();
  }
  async getUserNotifs(user: ObjectId | string) {
    const notifs = await notificationsModel.find({ user });
    await notificationsModel.updateMany(
      { user, readed: false },
      { readed: true }
    );
    return notifs;
  }

  async getAllNotifs() {
    return await notificationsModel.find();
  }
  async deleteNotif(id: ObjectId | string) {
    return await notificationsModel.findByIdAndDelete(id);
  }
}

export default new NotifService();
