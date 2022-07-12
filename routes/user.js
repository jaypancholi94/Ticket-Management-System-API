const express = require("express");
const router = express.Router();

/* Packages */
const {
    createUser,
    listUsers,
    listAllUsers,
    deleteUser,
    updateUser,
    updateUserPassword,
    updateUserByAdmin,
} = require("../controllers/user");
/* Middleware */
const { getUserById } = require("../utils/middlewares/user");
const { verifyToken } = require("../utils/middlewares/auth");
const { userExists } = require("../utils/middlewares/validators/user");
const {
    verifyPermission,
    verifyAssignedRole,
} = require("../utils/middlewares/role");

router.post(
    "/user",
    verifyToken,
    verifyPermission("user", "create"),
    userExists,
    verifyAssignedRole,
    createUser
);
router.get("/users", verifyToken, verifyPermission("user", "read"), listUsers);
router.get(
    "/users/all",
    verifyToken,
    verifyPermission("user", "read"),
    listAllUsers
);
router.delete(
    "/user/:u_id",
    verifyToken,
    verifyPermission("user", "delete"),
    deleteUser
);
router.patch("/user", verifyToken, userExists, updateUser);
router.patch("/user/password", verifyToken, userExists, updateUserPassword);

router.patch(
    "/user/:u_id",
    verifyToken,
    verifyPermission("user", "update"),
    userExists,
    updateUserByAdmin
);

/* Params */
router.param("u_id", getUserById);

module.exports = router;
