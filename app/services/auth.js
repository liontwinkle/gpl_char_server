const jwt = require('jsonwebtoken');
const cfg = require('../config');
const userModel = require('../models/user').userModel;
const ApiError = require('../utils/apiError');
const authRes = require('../responses/auth').authRes;

exports.registerUser = async user => {
  try {
    const newUser = new userModel(user);
    await newUser.save();
  } catch (err) {
    const isMongoError = err.name === 'MongoError';
    const isValidationError = err.name === 'ValidationError';
    if (isMongoError && err.code === 11000) {
      throw new ApiError({
        message: 'The email is already in use',
        status: 400,
      });
    }
    if (isValidationError) {
      // todo: write custom validator(s) instead
      const { name, email, password } = err.errors;
      const error = name || email || password;
      throw new ApiError({
        message: error.message,
        status: 400,
      });
    }
    throw err;
  }

  const token = exports.genJwt({ userId: newUser._id });
  return authRes({ user: newUser, token });
};

exports.genJwt = ({ userId, expiresIn = '14d' }) => {
  return jwt.sign({ id: userId }, cfg.secret, { expiresIn });
};

exports.loginUser = async credential => {
  if (!credential) throw new ApiError({ status: 400 });

  const user = await userModel.findOne({ email: credential.email }).exec();
  if (!user) {
    throw new ApiError({ message: 'User does not exist', status: 400 });
  }

  const isPasswordsMatch = await user.isPasswordsMatch(credential.password);
  if (!isPasswordsMatch) {
    throw new ApiError({
      message: 'Passwords do not match',
      status: 401,
    });
  }

  const token = exports.genJwt({ userId: user._id });
  return authRes({ user, token });
};

exports.verifyUser = async token => {
  const payload = await exports.getPayloadFromToken(token);
  const user = await exports.findUserById(payload.id);
  if (!user) {
    throw new ApiError({ message: 'User is not found', status: 400 });
  }

  return authRes({ user });
};

exports.verifyToken = token => jwt.verify(token, cfg.secret);

exports.findUserById = id => userModel.findById(id).exec();

exports.getPayloadFromToken = async token => {
  try {
    return await exports.verifyToken(token);
  } catch (err) {
    throw new ApiError({ message: err.message, status: 400 });
  }
};

exports.tokenUpdate = async token => {
  const payload = await exports.getPayloadFromToken(token);
  const user = await exports.findUserById(payload.id);
  if (!user) {
    throw new ApiError({ message: 'User is not found', status: 400 });
  }

  const newToken = exports.genJwt({
    userId: payload.id,
    expiresIn: '1h',
  });

  return authRes({ token: newToken });
};
