const { Schema, model } = require('mongoose');

const TemplateSchema = new Schema({
    type: { type: String, required: true, default: 'custom' },
    title: { type: String, required: true },
    image: { type: String, required: true },
    body: { type: String, required: true },
})

module.exports = model('NotifTemplates', TemplateSchema)