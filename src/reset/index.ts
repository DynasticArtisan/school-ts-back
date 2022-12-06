import { connect } from "mongoose";
import config from "config";
import notifTemplatesModel, {
  NoteTemplateTypes,
} from "../models/notifTemplates.model";
import notifications from "./notifications";
import MailTemplateModel, { MailTypes } from "../models/mailTemplates.model";
import { ActivationMail, ResetPasswordMail } from "./mails";
(async function () {
  try {
    await connect(config.get("DBURL"));
    await resetUserNotifTemplates();
    await resetHomeworkNotifTemplates();
    await resetCourseNotifTemplates();
    console.log("Шаблоны уведомлений обновлены");
    await resetMailTemplates();
    console.log("Шаблоны писем обновлены");
  } catch (e) {
    console.log(e);
  }
})();

async function resetMailTemplates() {
  await MailTemplateModel.deleteMany({ type: MailTypes.activate });
  await MailTemplateModel.create({
    type: MailTypes.activate,
    ...ActivationMail,
  });
  await MailTemplateModel.deleteMany({ type: MailTypes.resetpassword });
  await MailTemplateModel.create({
    type: MailTypes.resetpassword,
    ...ResetPasswordMail,
  });
}

async function resetUserNotifTemplates() {
  await notifTemplatesModel.deleteMany({ type: NoteTemplateTypes.newUser });
  const templates = notifications.newUser;
  await notifTemplatesModel.create(
    templates.map((template) => ({
      ...template,
      type: NoteTemplateTypes.newUser,
    }))
  );
}

async function resetHomeworkNotifTemplates() {
  await notifTemplatesModel.deleteMany({
    type: NoteTemplateTypes.homeworkAccept,
  });
  await notifTemplatesModel.create({
    ...notifications.homeworkAccept,
    type: NoteTemplateTypes.homeworkAccept,
  });
  await notifTemplatesModel.deleteMany({
    type: NoteTemplateTypes.homeworkReject,
  });
  await notifTemplatesModel.create({
    ...notifications.homeworkReject,
    type: NoteTemplateTypes.homeworkReject,
  });
}

async function resetCourseNotifTemplates() {
  await notifTemplatesModel.deleteMany({
    type: NoteTemplateTypes.courseLock,
  });
  await notifTemplatesModel.create({
    ...notifications.courseLock,
    type: NoteTemplateTypes.courseLock,
  });
  await notifTemplatesModel.deleteMany({
    type: NoteTemplateTypes.courseUnlock,
  });
  await notifTemplatesModel.create({
    ...notifications.courseUnlock,
    type: NoteTemplateTypes.courseUnlock,
  });
}
