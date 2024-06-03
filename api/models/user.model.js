const mongoose = require('mongoose');

const roleEnum = ['ADMIN', 'USER']; 
const accountStatusEnum = ['VALIDE', 'RADIE']; 

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  address: { type: String },
  companyNote: { type: Number, default: 0 },
  role: { type: String, enum: roleEnum, default:'USER'},
  accountStatus: {type: String, enum:accountStatusEnum, default:'VALIDE'},
  balance:{type:Number,default:0}
});

const User = mongoose.model('User', userSchema);

module.exports = {User,roleEnum};
