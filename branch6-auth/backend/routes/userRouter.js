const express = require("express");
const { signupUser, loginUser, getMe } = require("../controllers/userControllers");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/getme", getMe);

module.exports = router;
