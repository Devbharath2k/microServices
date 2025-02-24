import Joi from 'joi';

// User Validation Schema
const userValidationSchema = Joi.object({
    fname: Joi.string().trim().required(),
    lname: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).optional(), // Only numbers allowed
    password: Joi.string().min(1).required(), // Min 6 characters
    role: Joi.string().valid('user', 'admin').default('user'),
    isactive: Joi.string().valid('active', 'inactive', 'suspend').default('active'),
    lastlogin: Joi.date().default(Date.now),
    refresh_token: Joi.string().optional(),
    isverified: Joi.boolean().default(false),
    
    profile: Joi.object({
        bio: Joi.string().optional(),
        skills: Joi.array().items(Joi.string()).optional(),
        education: Joi.array().items(Joi.string()).optional(),
        experience: Joi.string().optional(),
        location: Joi.string().optional(),
        resume: Joi.string().default(""),
        profilephoto: Joi.string().default(""),
        originalname: Joi.string().optional(),
    }).optional(),
});

export default userValidationSchema
