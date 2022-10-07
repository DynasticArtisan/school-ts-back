const templatesModel = require("../../models/notifications/templatesModel")

class TemplateService {
    async createTemplate(template){
        return await templatesModel.create(template)
    }
    async getAllTemplates(){
        return await templatesModel.find()
    }
    async getCustomTemplates(){
        return await templatesModel.find({ type: 'custom' })
    }
    async getTemplate(id){
        return await templatesModel.findById(id)
    }
    async updateTemplate(id, payload){
        return await templatesModel.findByIdAndUpdate(id, payload, { new: true })
    }
    async deleteTemplate(id){
        return await templatesModel.findByIdAndDelete(id)
    }
}

module.exports = new TemplateService()