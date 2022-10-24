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
        title: template.title,
        icon: template.icon,
        image: template.image,
        body: template.replace({ user: UserDocument }),
      }))
    );
    return Notifications;
  }

  async createHomeworkRejectNotif(
    user: ObjectId | String,
    lesson: LessonDocument
  ) {
    const Template = await notifTemplateService.getSpecialTemplate(
      NotifTemplateTypes.homeworkReject
    );
    return await notificationsModel.create({
      user,
      title: Template.title,
      image: Template.image,
      icon: Template.icon,
      body: Template.replace({ lesson }),
    });
  }
  async createHomeworkAcceptNotif(
    user: ObjectId | String,
    lesson: LessonDocument
  ) {
    const Template = await notifTemplateService.getSpecialTemplate(
      NotifTemplateTypes.homeworkAccept
    );
    return await notificationsModel.create({
      user,
      title: Template.title,
      image: Template.image,
      icon: Template.icon,
      body: Template.replace({ lesson }),
    });
  }

  async createCourseLockNotif(user: ObjectId | string, course: CourseDocument) {
    const Template = await notifTemplateService.getSpecialTemplate(
      NotifTemplateTypes.courseLock
    );
    return await notificationsModel.create({
      user,
      title: Template.title,
      image: Template.image,
      icon: Template.icon,
      body: Template.replace({ course }),
    });
  }
  async createCourseUnlockNotif(
    user: ObjectId | String,
    course: CourseDocument
  ) {
    const Template = await notifTemplateService.getSpecialTemplate(
      NotifTemplateTypes.courseLock
    );
    return await notificationsModel.create({
      user,
      title: Template.title,
      image: Template.image,
      icon: Template.icon,
      body: Template.replace({ course }),
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
