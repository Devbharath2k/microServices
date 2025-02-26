import Joi from "joi";

const companyValidationSchema = Joi.object({
  companyName: Joi.string().required().messages({
    "string.empty": "Company name is required",
    "any.required": "Company name is required",
  }),
  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be a string",
  }),
  website: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Website must be a valid URL",
    "string.base": "Website must be a string",
  }),
  location: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Location must be an array of strings",
    "string.base": "Each location must be a string",
  }),
  experience: Joi.string().allow("").optional().messages({
    "string.base": "Experience must be a string",
  }),
  logo: Joi.string().allow("").optional().default("").messages({
    "string.base": "Logo must be a string",
  }),
  mediaId: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Media ID must be an array of strings",
    "string.base": "Each media ID must be a string",
  }),
  userId: Joi.string()
    .required()
    .messages({
      "string.pattern.base": "User ID must be a valid MongoDB ObjectId",
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
    }),
  createdAt: Joi.date().default(Date.now).optional().messages({
    "date.base": "Created date must be a valid date",
  }),
}).options({ abortEarly: false });

export default companyValidationSchema;