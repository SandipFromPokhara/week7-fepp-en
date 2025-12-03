const express = require("express");
const { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/productControllers");
const requireAuth = require('../middleware/requireAuth');
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

router.get("/", requireAuth, getAllProducts);
router.get("/:productId", requireAuth, getProductById);

router.post("/", requireAuth, roleCheck("Admin", "Seller"), createProduct);
router.put("/:productId", requireAuth, roleCheck("Admin"), updateProduct);
router.delete("/:productId", requireAuth, roleCheck("Admin"), deleteProduct);

module.exports = router;
