const express = require("express");
const router = express.Router();

/* Package */
const { login } = require("../controllers/auth");
/* Middleware */
const {
    loginFieldsvalidator,
} = require("../utils/middlewares/validators/forms");

router.post("/login", loginFieldsvalidator, login);

module.exports = router;
