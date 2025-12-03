const express = require("express");
const { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/productControllers");
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:productId", getProductById);

router.post("/", requireAuth, createProduct);
router.put("/:productId", requireAuth, updateProduct);
router.delete("/:productId", requireAuth, deleteProduct);

module.exports = router;
