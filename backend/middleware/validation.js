// server/middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateRoomCreation = [
  body('roomId').isString().notEmpty().withMessage('roomId is required'),
  body('isPrivate').isBoolean().withMessage('isPrivate must be boolean'),
  body('owner').isString().notEmpty().withMessage('owner is required'),
  body('description').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];


const validateUserJoin = [
  body('username').isString().notEmpty().withMessage('username is required'),
  body('roomId').isString().notEmpty().withMessage('roomId is required'),
  body('socketId').isString().notEmpty().withMessage('socketId is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

const validateDrawingSave = [
  body('roomId').isString().notEmpty().withMessage('roomId is required'),
  body('strokeData').isObject().notEmpty().withMessage('strokeData must be a valid object'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

const validateMessage = [
  body('roomId').isString().notEmpty().withMessage('roomId is required'),
  body('sender').isString().notEmpty().withMessage('sender is required'),
  body('text').isString().notEmpty().withMessage('text is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRoomCreation,
  validateUserJoin,
  validateDrawingSave,
  validateMessage,
};
