const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  discount: { type: Number, default: 0 },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  comment: { type: String, default: '' },
  addedDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  image: { type: String, default: '' },
  nbSales: {type:Number,default:0}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
