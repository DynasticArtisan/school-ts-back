import ApiError from "../exceptions/ApiError";
import MailTemplatesModel, { MailTypes } from "../models/mailTemplates.model";

class MailTemplatesService {
  async getTemplates() {
    return await MailTemplatesModel.find();
  }
  async getCustomTemplates() {
    return await MailTemplatesModel.find({ type: MailTypes.custom });
  }

  async getTemplate(templateId: string) {
    const Template = await MailTemplatesModel.findById(templateId);
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }
  async getCustomTemplate(templateId: string) {
    const Template = await MailTemplatesModel.findOne({
      _id: templateId,
      type: MailTypes.custom,
    });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }
  async getSpecialTemplate(type: MailTypes) {
    const Template = await MailTemplatesModel.findOne({ type });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }

  async createTemplate(
    type: MailTypes,
    title: string,
    subject: string,
    html: string
  ) {
    const Template = await MailTemplatesModel.create({
      type,
      title,
      subject,
      html,
    });
    if (!Template) {
      throw ApiError.BadRequest("Не удалось создать шаблон");
    }
    return Template;
  }
  async createCustomTemplate(title: string, subject: string, html: string) {
    const Template = await MailTemplatesModel.create({
      type: MailTypes.custom,
      title,
      subject,
      html,
    });
    if (!Template) {
      throw ApiError.BadRequest("Не удалось создать шаблон");
    }
    return Template;
  }

  async updateTemplate(
    templateId: string,
    type: MailTypes,
    title: string,
    subject: string,
    html: string
  ) {
    const Template = await MailTemplatesModel.findByIdAndUpdate(
      templateId,
      { type, title, subject, html },
      { new: true }
    );
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    return Template;
  }
  async updateCustomTemplate(
    templateId: string,
    title: string,
    subject: string,
    html: string
  ) {
    const Template = await MailTemplatesModel.findOneAndUpdate(
      { _id: templateId, type: MailTypes.custom },
      { title, subject, html },
      { new: true }
    );
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    return Template;
  }

  async deleteTemplate(templateId: string) {
    const Template = await MailTemplatesModel.findByIdAndDelete(templateId);
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    return true;
  }
  async deleteCustomTemplate(templateId: string) {
    const Template = await MailTemplatesModel.findOneAndDelete({
      _id: templateId,
      type: MailTypes.custom,
    });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон письма не найден");
    }
    return true;
  }
}

export default new MailTemplatesService();
