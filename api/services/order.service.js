const {Order,orderStatusEnum} = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const {getCurrentUser} = require("./user.service")

async function getOrdersByUserId(req) {
  user = await getCurrentUser(req);
  return await Order.find({ user: user._id }).populate('user purchases.product');
}

async function getPendingOrders() {
  return await Order.find({ orderStatus: 'VALIDE' });
}

async function createOrder(req,orderData) {
  let total = 0;
  for (let purchase of orderData.purchases) {
    const product = await Product.findById(purchase.product.id);
    if (!product) {
      throw new Error("Le produit n'existe pas");
    }
    console.log("stovk",product.stock);
    console.log("quntity",purchase.quantite)
    if (product.stock < purchase.quantite) {
      throw new Error("La quantité commandée excède le stock disponible");
    }
    const purchasePrice = calculatePrice(product, purchase.quantite);
    total += purchasePrice;
  }
  const user = await getCurrentUser(req);

  if (total > user.balance) {
    throw new Error("Votre solde est insuffisant");
  }
  
  for (let purchase of orderData.purchases) {
    const product = await Product.findById(purchase.product.id);
    if (!product) {
      throw new Error("Le produit n'existe pas");
    }
    if (product.stock < purchase.quantite) {
      throw new Error("La quantité commandée excède le stock disponible");
    }
    product.stock -= purchase.quantite;
    product.nbSales += purchase.quantite;
    purchase.product = product._id;
    const purchasePrice = calculatePrice(product, purchase.quantite);
    total += purchasePrice;
    await product.save();
    purchase.purchasePrice = purchasePrice;
  }

  const order = new Order({
    ...orderData,
    user: user._id,
    total,
    commandDateTime: new Date(),
    deliveryAddress: user.address,
    orderStatus: "VALIDE"
  });

  await order.save();

  user.balance = user.balance - total;
  await user.save();

  return order;
}

async function getPurchaseInfo(basket) {
  const purchases = [];

  for (let productId in basket) {
    const product = await Product.findById(productId);
    const quantite = basket[productId];
    const purchasePrice = calculatePrice(product, quantite);
    purchases.push({ product: product, quantite, purchasePrice });
  }

  return purchases;
}

async function shipOrder(orderData) {
  return await Order.findByIdAndUpdate(orderData._id, {orderStatus:"EXPEDIE"});
}

function calculatePrice(product, quantite) {
  let productPrice = product.discount ? product.price - (product.discount * product.price / 100) : product.price;
  return quantite * productPrice;
}

module.exports = {
  getOrdersByUserId,
  createOrder,
  getPurchaseInfo,
  shipOrder,
  getPendingOrders
};
