//!!VALIDATION
import joi from "@hapi/joi";

const Joi = joi;

//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required(),
  });

  const validation = schema.validate(data);
  return validation;
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required(),
  });

  const validation = schema.validate(data);
  return validation;
};

export { registerValidation };
export { loginValidation };
