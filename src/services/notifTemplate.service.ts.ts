import { ObjectId } from "mongoose";
import ApiError from "../exceptions/ApiError";
import templatesModel, {
  NotifTemplateTypes,
} from "../models/notifTemplates.model";

class TemplateService {
  async createTemplate(payload: {
    title: string;
    icon?: string;
    image?: string;
    body: string;
  }) {
    return await templatesModel.create(payload);
  }
  async updateTemplate(
    id: ObjectId | string,
    payload: {
      title: string;
      icon?: string;
      image?: string;
      body: string;
    }
  ) {
    return await templatesModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
  }
  async deleteTemplate(id: ObjectId | string) {
    return await templatesModel.findByIdAndDelete(id);
  }
  async getAllTemplates() {
    return await templatesModel.find();
  }
  async getCustomTemplates() {
    return await templatesModel.find({ type: "custom" });
  }
  async getTemplate(id: ObjectId | string) {
    const Template = await templatesModel.findById(id);
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }
  async getSpecialTemplate(type: NotifTemplateTypes) {
    const Template = await templatesModel.findOne({ type });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }
  async getManySpecialTemplates(type: NotifTemplateTypes) {
    const Templates = await templatesModel.find({ type });
    if (!Templates.length) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Templates;
  }
}

export default new TemplateService();
