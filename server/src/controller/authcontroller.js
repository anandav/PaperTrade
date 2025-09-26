
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ApiError = require('../common/ApiError');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required.');
  }
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(400, 'Username already exists');
    }
    throw error;
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required.');
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.send({ user, token });
};
