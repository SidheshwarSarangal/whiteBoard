// server/utils/authUtils.js
const jwt = require('jsonwebtoken');

const generateToken = (userPayload) => {
  return jwt.sign(userPayload, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

module.exports = { generateToken };
