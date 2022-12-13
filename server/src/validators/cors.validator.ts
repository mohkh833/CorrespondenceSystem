const Joi = require('joi');

exports.cors = Joi.object()
    .keys({
        correspondence_no: Joi
            .string()
            .min(3)
            .max(40)
            .required().messages({
                "string.empty": "422.101",
                "string.min": "422.102",
                "string.max": "422.103",
                "any.required": "422.104",
                "string.base": "422.105"
            }),
        correspondence_type: Joi
            .string()
            .min(3)
            .max(40)
            .required().messages({
                "string.empty": "422.201",
                "string.min": "422.202",
                "string.max": "422.203",
                "any.required": "422.204",
                "any.base": "422.205"
            }),
        entry_no: Joi
            .string()
            .min(3)
            .max(20)
            .required().messages({
                "string.empty": "422.301",
                "string.min": "422.302",
                "string.max": "422.303",
                "any.required": "422.304",
                "any.base": "422.305"
            }),
        correspondence_subject: Joi
            .string()
            .min(3)
            .max(20)
            .required().messages({
                "string.empty": "422.401",
                "string.min": "422.402",
                "string.max": "422.403",
                "any.required": "422.404",
                "any.base": "422.405"
            }),
        to_department: Joi
            .string()
            .required().messages({
                "string.empty": "422.501",
                "string.min": "422.502",
                "string.max": "422.503",
                "any.required": "422.504",
                "any.base": "422.505"
            }),
        classification: Joi
            .string()
            .required().messages({
                "string.empty": "422.601",
                "string.min": "422.602",
                "string.max": "422.603",
                "any.required": "422.604",
                "any.base": "422.605"
            }),
        cc_entity: Joi
            .array().items(Joi.string().messages({
                "string.empty": "422.701",
            })).messages({
                "array.base": "422.702"
            }),
        to_entity: Joi
            .string()
            .required().messages
            ({
                "string.empty": "422.801",
                "string.base": "422.802"
            }),
        priority: Joi
            .string()
            .required().messages({
                "string.empty": "422.901",
                "string.base": "422.902"
            }),
        await_reply: Joi
            .boolean().messages({
                "boolean.base": "422.1001"
            }),
        due_date: Joi
            .string().messages({
                "string.empty": "422.1101",
                "string.base": "422.1102"
            }),
        correspondence_body: Joi
            .string()
            .required()
            .min(3).messages({
                "string.empty": "422.1201",
                "string.base": "422.1202",
                "string.min": "422.1203"
            }),
    });