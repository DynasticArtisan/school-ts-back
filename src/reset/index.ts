import { connect } from "mongoose";
import config from "config";
import notifTemplatesModel, {
  NotifTemplateTypes,
} from "../models/notifTemplates.model";
import notifications from "./notifications";

(async function () {
  try {
    await connect(config.get("DBURL"));
    await resetUserNotifTemplates();
    await resetHomeworkNotifTemplates();
    await resetCourseNotifTemplates();
    console.log("Шаблоны уведомлений обновлены");
  } catch (e) {
    console.log(e);
  }
})();

async function resetUserNotifTemplates() {
  await notifTemplatesModel.deleteMany({ type: NotifTemplateTypes.newUser });
  const templates = notifications.newUser;
  await notifTemplatesModel.create(
    templates.map((template) => ({
      ...template,
      type: NotifTemplateTypes.newUser,
    }))
  );
}

async function resetHomeworkNotifTemplates() {
  await notifTemplatesModel.deleteMany({
    type: NotifTemplateTypes.homeworkAccept,
  });
  await notifTemplatesModel.create({
    ...notifications.homeworkAccept,
    type: NotifTemplateTypes.homeworkAccept,
  });
  await notifTemplatesModel.deleteMany({
    type: NotifTemplateTypes.homeworkReject,
  });
  await notifTemplatesModel.create({
    ...notifications.homeworkReject,
    type: NotifTemplateTypes.homeworkReject,
  });
}

async function resetCourseNotifTemplates() {
  await notifTemplatesModel.deleteMany({
    type: NotifTemplateTypes.courseLock,
  });
  await notifTemplatesModel.create({
    ...notifications.courseLock,
    type: NotifTemplateTypes.courseLock,
  });
  await notifTemplatesModel.deleteMany({
    type: NotifTemplateTypes.courseUnlock,
  });
  await notifTemplatesModel.create({
    ...notifications.courseUnlock,
    type: NotifTemplateTypes.courseUnlock,
  });
}
