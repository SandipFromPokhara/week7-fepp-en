const express = require("express");
const { getAllProducts, createProduct, getProductById, deleteProduct } = require("../controllers/productControllers");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:productId", getProductById);
router.delete("/:productId", deleteProduct);

module.exports = router;