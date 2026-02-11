const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({           // optional
            filename: Joi.string().allow(""), // allow empty string
            url: Joi.string().uri().allow("") // allow empty string
        }).optional()
    }).required(),
});
