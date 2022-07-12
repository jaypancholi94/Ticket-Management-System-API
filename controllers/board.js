const { boards, users } = require("../models");
const { omit } = require("lodash");

exports.createBoard = (req, res) => {
    const { title, description, members } = req.body;
    boards
        .create({
            title,
            description,
            members,
            owner_id: req.loggedInUser.u_id,
        })
        .then((board) => {
            res.status(200).json({
                success: true,
                message: `${title} has been created`,
                board: {
                    b_id: board.b_id,
                    title,
                    description,
                    members,
                    owner: req.loggedInUser.u_id,
                },
            });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.updateBoard = (req, res) => {
    const { b_id } = req.params;
    const { title, description } = req.body;
    if (!b_id) {
        return res.status(403).json({
            error: true,
            message: `Something went wrong`,
        });
    }

    boards
        .findOne({ where: { b_id } })
        .then((board) => {
            if (!board) {
                return res.status(403).json({
                    error: true,
                    message: `Board is not available`,
                });
            }
            if (board.owner_id === req.loggedInUser.u_id) {
                board
                    .update({ title, description })
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            message: `${title} has been created`,
                            board: {
                                b_id: board.b_id,
                                title,
                                description,
                            },
                        });
                    })
                    .catch((error) => {
                        return res
                            .status(500)
                            .json({ error: true, message: error.message });
                    });
            } else {
                return res.status(401).json({
                    error: true,
                    message: `You are not the owner of this board`,
                });
            }
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.getBoards = (req, res) => {
    boards
        .findAll({
            attributes: {
                exclude: ["owner_id"],
            },
            include: [
                {
                    model: users,
                    as: "owner",
                    attributes: ["first_name", "last_name", "u_id", "email"],
                },
            ],
        })
        .then((boards) => {
            let result = [];
            boards.map((board) => {
                result = [
                    ...result,
                    omit(board.dataValues, ["createdAt", "updatedAt"]),
                ];
            });
            res.status(200).json(result);
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.deleteBoard = (req, res) => {
    const { b_id } = req.params;
    const { transferTo } = req.body;

    if (!b_id) {
        return res.status(403).json({
            error: true,
            message: `Something went wrong`,
        });
    }

    boards.findOne({ where: { b_id } }).then((board) => {
        if (!board) {
            return res
                .status(403)
                .json({ error: true, message: `Board is not available` });
        }
        if (board.owner_id === req.loggedInUser.u_id) {
            // TODO: Delete / transfer all the tickets under this board.
            board
                .destroy()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        message: `Board has been deleted`,
                    });
                })
                .catch((error) => {
                    return res
                        .status(500)
                        .json({ error: true, message: error.message });
                });
        } else {
            return res.status(401).json({
                error: true,
                message: `You are not the owner of this board`,
            });
        }
    });
};
/* 
exports.addMember = (req, res) => {
    const { b_id } = req.params;
    const { memberList } = req.body;

    if (!b_id) {
        return res.json({
            error: true,
            message: `Something went wrong`,
        });
    }

    boards.findOne({ where: { b_id } }).then((board) => {
        if (!board) {
            return res.json({ error: true, message: `Board is not available` });
        }
        if (board.owner_id === req.loggedInUser.u_id) {
            board.update({ member: memberList }).then(() => {
                res.json({
                    success: true,
                    message: `Member added to this board`,
                });
            });
        } else {
            return res.json({
                error: true,
                message: `You are not the owner of this board`,
            });
        }
    });
};

exports.removeMember = (req, res) => {
    const { b_id } = req.params;
    const { memberList } = req.body;

    if (!b_id) {
        return res.json({
            error: true,
            message: `Something went wrong`,
        });
    }

    boards.findOne({ where: { b_id } }).then((board) => {
        if (!board) {
            return res.json({ error: true, message: `Board is not available` });
        }
        if (board.owner_id === req.loggedInUser.u_id) {
            board.update({ member: memberList }).then(() => {
                res.json({
                    success: true,
                    message: `Member removed to this board`,
                });
            });
        } else {
            return res.json({
                error: true,
                message: `You are not the owner of this board`,
            });
        }
    });
};
 */
