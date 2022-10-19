import { ObjectId } from "mongoose";
import { CourseDocument } from "src/models/courseModel";
import notificationsModel from "src/models/notifications/notificationsModel";
import templatesModel from "src/models/notifications/templatesModel";
import { HomeworkStatus } from "src/utils/statuses";

const ApiError = require("../../exceptions/ApiError");

const replacer = require("../../utils/replacer");

class NotifService {
  async getAllNotifs() {
    return await notificationsModel.find();
  }

  async checkNewUserNotifs(user: ObjectId) {
    return await notificationsModel.findOne({ user, readed: false }).count();
  }

  async getUserNotifs(user: ObjectId) {
    const notifs = await notificationsModel.find({ user });
    await notificationsModel.updateMany(
      { user, readed: false },
      { readed: true }
    );
    return notifs;
  }
  async deleteNotif(id: ObjectId) {
    return await notificationsModel.findByIdAndDelete(id);
  }

  async createCustomNotif(id: ObjectId, user: ObjectId) {
    const Template = await templatesModel.findById(id);
    if (!Template) {
      throw ApiError.BadRequest(`Шаблон уведомления не найден`);
    }
    const { title, image, icon, body } = Template;
    return await notificationsModel.create({ user, title, image, icon, body });
  }
  async createManyCustomNotif(id: ObjectId, users: ObjectId[]) {
    const Template = await templatesModel.findById(id);
    if (!Template) {
      throw ApiError.BadRequest(`Шаблон уведомления не найден`);
    }
    const { title, image, icon, body } = Template;
    return await notificationsModel.create(
      users.map((user) => ({ user, title, image, icon, body }))
    );
  }

  // домашние задания
  async createHomeworkNotif(
    user: ObjectId,
    lesson: any,
    status: HomeworkStatus
  ) {
    const Template = await templatesModel.findOne({ type: `hw-${status}` });
    if (!Template) {
      throw ApiError.BadRequest(`Шаблон уведомления не найден`);
    }
    const { title, image, icon, body } = Template;
    return await notificationsModel.create({
      user,
      title,
      image,
      icon,
      body: replacer(body, { lesson }),
    });
  }

  // Доступ к курсу
  async createCourseLockNotif(user: ObjectId, course: CourseDocument) {
    const Template = await templatesModel.findOne({ type: "course-lock" });
    if (!Template) {
      throw ApiError.BadRequest(`Шаблон уведомления не найден`);
    }
    const { title, image, body } = Template;
    return await notificationsModel.create({
      user,
      title,
      image,
      body: replacer(body, { course }),
    });
  }
  async createCourseUnlockNotif(user: ObjectId, course: CourseDocument) {
    const Template = await templatesModel.findOne({ type: "course-unlock" });
    if (!Template) {
      throw ApiError.BadRequest(`Шаблон уведомления не найден`);
    }
    const { title, image, body } = Template;
    return await notificationsModel.create({
      user,
      title,
      image,
      body: replacer(body, { course }),
    });
  }

  async createNewUserNotifs(user: any) {
    const Templates = await templatesModel.find({ type: "new-user" });
    if (!Templates.length) {
      throw ApiError.BadRequest(`Шаблон уведомления не найден`);
    }
    const notifs = Templates.map(({ title, image, icon, body }) => ({
      user: user.id,
      title,
      image,
      icon,
      body: replacer(body, { user }),
    }));
    return await notificationsModel.create(notifs);
  }
}

export default new NotifService();
