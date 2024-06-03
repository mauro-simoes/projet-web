const express = require("express");
const router = express.Router();
const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/product.controller.js');
const { authenticateToken, authorizeRoles } = require('../middleware/middleware');


router.get('/get/all/:category',getProducts);

router.get("/get/:id", getProduct);

router.post("/ajouter-produit",authenticateToken, authorizeRoles(['ADMIN']), createProduct);

router.put("/mettre-a-jour/",authenticateToken, authorizeRoles(['ADMIN']), updateProduct);

router.delete("/supprimer-produit/:id",authenticateToken, authorizeRoles(['ADMIN']), deleteProduct);




module.exports = router;