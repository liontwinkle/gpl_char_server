const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const emailValidator = require('email-validator').validate;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
    maxlength: 20,
    required: [true, 'User name is missing'],
    validate: {
      validator: v => /^[a-zA-Z][a-zA-Z0-9-_]+?$/.test(v),
      msg: 'Name is badly formatted',
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'User email is missing'],
    validate: {
      validator: emailValidator,
      msg: 'Email is incorrect',
    },
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'User password is missing'],
  },
});

userSchema.methods = {
  genHashForPassword() {
    return bcrypt.hash(this.password, bcrypt.genSaltSync(8), null);
  },
  isPasswordsMatch(password) {
    return bcrypt.compare(password, this.password);
  },
};

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.password = await this.genHashForPassword();
  }
  next();
});

const userModel = mongoose.model('user', userSchema);

module.exports = {
  userSchema,
  userModel,
};
