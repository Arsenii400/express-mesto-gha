const { celebrate, Joi } = require('celebrate');

module.exports.createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

module.exports.CardByIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});
