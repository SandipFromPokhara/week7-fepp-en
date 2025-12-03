const express = require("express");
const {
  getAllProducts,
  createProduct,
} = require("../controllers/productControllers");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);

module.exports = router;
