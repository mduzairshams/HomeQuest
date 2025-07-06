const Joi = require('joi');
const reviews = require('./models/review');

module.exports.listingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        location:Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow('').optional(), // allow empty string so Mongoose can set default
            filename: Joi.string().optional(),       // optional in case it's not provided
        }).optional(),
    }).required(),
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
})