/* Package */
const { boards } = require("../../../models");

exports.getBoardID = (req, res, next, b_id) => {
    boards.findOne({ where: { b_id } }).then((board) => {
        if (board) {
            req.boardData = board;
            next();
        } else {
            return res.json({ error: true, messgae: "Invalid Board" });
        }
    });
};
