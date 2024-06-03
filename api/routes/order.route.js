const express = require('express');
const orderService = require('../services/order.service');
const { authenticateToken, authorizeRoles } = require('../middleware/middleware');

const router = express.Router();

router.get('/get-commandes',authenticateToken,async (req, res) => {
  try {
    const commands = await orderService.getOrdersByUserId(req);
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/get-commandes-en-attente',authenticateToken, authorizeRoles(['ADMIN']),async (req, res) => {
  try {
    const commands = await orderService.getPendingOrders();
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/commander', authenticateToken, async (req, res) => {
  try {
    const order = await orderService.createOrder(req,req.body);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(400).json({ message: "La commande n'a pas pu être créée." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/basket-info', authenticateToken, async (req, res) => {
  try {
    const basket = req.body;
    const purchases = await orderService.getPurchaseInfo(basket);
    if (purchases.length > 0) {
      res.status(200).json(purchases);
    } else {
      res.status(400).json({ message: "La commande n'a pas pu être créée." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/expedier', authenticateToken,authorizeRoles(['ADMIN']), async (req, res) => {
  try {
    const order = req.body;
    const orderShipped = await orderService.shipOrder(order);
    if (orderShipped) 
      res.status(200).json(true);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;


