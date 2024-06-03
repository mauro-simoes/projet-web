const {User} = require('../models/user.model');
const bcrypt = require('bcryptjs');

async function getAllUsers() {
  return await User.find({role:'USER'});
}

async function getUserById(userId) {
  return await User.findById(userId);
}

async function updateUser(userId, userData) {
  return await User.findByIdAndUpdate(userId, userData, { new: true });
}

async function resetPassword(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log('userId', userId);
  return await User.findByIdAndUpdate(userId, { password: hashedPassword });
}

async function getCurrentUser(req) {
  const userId = req.user.id;
  return await User.findById(userId);
}

async function topUpBalance(req) {
  user = await getCurrentUser(req);
  console.log("user",user);
  return await User.findByIdAndUpdate(user._id, { balance:user.balance+req.body.sum});
}

async function validateAccount(userId) {
  return await User.findByIdAndUpdate(userId, { accountStatus: 'ACTIVE' });
}

async function banAccount(userId) {
  return await User.findByIdAndUpdate(userId, { accountStatus: 'RADIE' });
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  resetPassword,
  getCurrentUser,
  validateAccount,
  banAccount,
  topUpBalance
};
