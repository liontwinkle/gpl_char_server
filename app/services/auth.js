const jwt = require('jsonwebtoken');
const cfg = require('../config');
const userModel = require('../models/user').userModel;
const apiError = require('../utils/apiError');
const authRes = require('../responses/auth').authRes;

exports.registerUser = async (user) => {
  const newUser = new userModel(user);

  try {
    await newUser.save();
  } catch (err) {
    const isMongoError = err.name === 'MongoError';
    if (isMongoError && err.code === 11000) {
      throw new apiError('The email is already in use');
    }
    throw err;
  }
  const token = exports.genJwt({ userId: newUser._id });

  return authRes({ user: newUser, token });
};

exports.genJwt = ({ userId, expiresIn = '14d' }) => {
  return jwt.sign(
    { id: userId },
    cfg.secret,
    { expiresIn }
  );
};

exports.loginUser = async (credential) => {
  if (!credential) throw new apiError();

  const user = await userModel
    .findOne({ email: credential.email })
    .exec();
  if (!user) throw new apiError('User does not exist');

  const isPasswordsMatch = await user.isPasswordsMatch(credential.password);
  if (!isPasswordsMatch) throw new apiError('Passwords do not match', 401);

  const token = exports.genJwt({ userId: user._id });
  return authRes({ user, token });
};

exports.verifyUser = async (token) => {
  const payload = await exports.getPayloadFromToken(token);
  const user = await exports.findUserById(payload.id);
  if (!user) throw new apiError('User is not found', 401);

  return authRes({ user });
};

exports.verifyToken = (token) => jwt.verify(token, cfg.secret);

exports.findUserById = (id) => userModel.findById(id).exec();

exports.getPayloadFromToken = async (token) => {
  try {
    return await exports.verifyToken(token);
  }
  catch (err) {
    throw new apiError(err.message, 401);
  }
}

exports.tokenUpdate = async (token) => {
  const payload = await exports.getPayloadFromToken(token);
  const user = await exports.findUserById(payload.id);
  if (!user) throw new apiError('User is not found', 401);

  const newToken = exports.genJwt({
    userId: payload.id,
    expiresIn: '1h'
  });

  return authRes({ token: newToken });
};