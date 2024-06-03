const mongoose = require('mongoose');
const User = require('./user.model');
const Product = require('./product.model');

const orderStatusEnum = ['VALIDE', 'EXPEDIE']; 

const purchaseSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantite: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purchases: [purchaseSchema],
  commandDateTime: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  orderStatus:{type: String, enum: orderStatusEnum, required:true}
});

const Order = mongoose.model('Order', orderSchema);

module.exports = {Order, orderStatusEnum};
