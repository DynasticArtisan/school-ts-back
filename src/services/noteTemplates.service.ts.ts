import templatesModel, {
  NoteTemplateTypes,
} from "../models/notifTemplates.model";
import ApiError from "../exceptions/ApiError";

class NoteTemplatesService {
  async getTemplates() {
    return await templatesModel.find();
  }
  async getCustomTemplates() {
    return await templatesModel.find({ type: "custom" });
  }
  async getSpecialTemplates(type: NoteTemplateTypes) {
    return await templatesModel.find({ type });
  }

  async getTemplate(templateId: string) {
    const Template = await templatesModel.findById(templateId);
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }
  async getCustomTemplate(templateId: string) {
    const Template = await templatesModel.findOne({
      _id: templateId,
      type: NoteTemplateTypes.custom,
    });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }
  async getSpecialTemplate(type: NoteTemplateTypes) {
    const Template = await templatesModel.findOne({ type });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }

  async createTemplate(
    type: NoteTemplateTypes,
    title: string,
    body: string,
    image?: string,
    icon?: string
  ) {
    return await templatesModel.create({ type, title, body, image, icon });
  }
  async createCustomTemplate(
    title: string,
    body: string,
    image?: string,
    icon?: string
  ) {
    return await templatesModel.create({ title, body, image, icon });
  }

  async updateTemplate(
    templateId: string,
    type: NoteTemplateTypes,
    title: string,
    body: string,
    image?: string,
    icon?: string
  ) {
    return await templatesModel.findByIdAndUpdate(
      templateId,
      { type, title, body, image, icon },
      { new: true }
    );
  }
  async updateCustomTemplate(
    templateId: string,
    title: string,
    body: string,
    image?: string,
    icon?: string
  ) {
    return await templatesModel.findOneAndUpdate(
      { _id: templateId, type: NoteTemplateTypes.custom },
      { title, body, image, icon },
      { new: true }
    );
  }

  async deleteTemplate(templateId: string) {
    const Template = await templatesModel.findByIdAndDelete(templateId);
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }
  async deleteCustomTemplate(templateId: string) {
    const Template = await templatesModel.findOneAndDelete({
      _id: templateId,
      type: NoteTemplateTypes.custom,
    });
    if (!Template) {
      throw ApiError.BadRequest("Шаблон уведомления не найден");
    }
    return Template;
  }
}

export default new NoteTemplatesService();
