const express = require("express");
const router = express.Router();

/* Packages */
const {
    createTicket,
    updateTicket,
    deleteTicket,
    getTicket,
    getTickets,
} = require("../controllers/ticket");

/* Middleware */
const { verifyToken } = require("../utils/middlewares/auth");
const { verifyPermission } = require("../utils/middlewares/role");
const { getBoardID } = require("../utils/middlewares/board");

router.post(
    "/:b_id/ticket/",
    verifyToken,
    verifyPermission("ticket", "create"),
    createTicket
);
router.patch("/:b_id/ticket/:t_id", verifyToken, updateTicket);
router.get("/:b_id/ticket/:t_id", verifyToken, getTicket);
router.get("/:b_id/tickets", verifyToken, getTickets);
router.delete("/:b_id/ticket/:t_id", verifyToken, deleteTicket);

router.param("b_id", getBoardID);

module.exports = router;
