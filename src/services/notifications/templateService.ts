import { ObjectId } from "mongoose";
import templatesModel, {
  ITemplate,
} from "src/models/notifications/templatesModel";

class TemplateService {
  async createTemplate(payload: ITemplate) {
    return await templatesModel.create(payload);
  }
  async getAllTemplates() {
    return await templatesModel.find();
  }
  async getCustomTemplates() {
    return await templatesModel.find({ type: "custom" });
  }
  async getTemplate(id: ObjectId) {
    return await templatesModel.findById(id);
  }
  async updateTemplate(id: ObjectId, payload: ITemplate) {
    return await templatesModel.findByIdAndUpdate(id, payload, { new: true });
  }
  async deleteTemplate(id: ObjectId) {
    return await templatesModel.findByIdAndDelete(id);
  }
}

export default new TemplateService();
