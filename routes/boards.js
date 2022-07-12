const express = require("express");
const router = express.Router();

/* Packages */
const {
    createBoard,
    updateBoard,
    getBoards,
    deleteBoard,
    addMember,
    removeMember,
} = require("../controllers/board");

/* Middleware */
const { verifyToken } = require("../utils/middlewares/auth");
const { verifyPermission } = require("../utils/middlewares/role");

router.post(
    "/board",
    verifyToken,
    verifyPermission("board", "create"),
    createBoard
);
router.patch("/board/:b_id", verifyToken, updateBoard);
router.get("/boards", verifyToken, getBoards);
router.delete("/board/:b_id", verifyToken, deleteBoard);
/* 
router.post("/board/:b_id/member", verifyToken, addMember);
router.delete("/board/:b_id/member", verifyToken, removeMember); */

module.exports = router;
