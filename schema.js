const Joi = require('joi');

module.exports.postSchema = Joi.object({
    post : Joi.object({
        username: Joi.string().alphanum().min(3).max(15).required(),
        imageUrl: Joi.string().required(),
        caption: Joi.string().max(250),
        createdAt:Joi.date().default(() => Date.now())
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        content:Joi.string().max(150).required()
    }).required()
})