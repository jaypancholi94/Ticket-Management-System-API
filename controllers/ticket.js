const { tickets, users } = require("../models");
const { has, omit } = require("lodash");

exports.createTicket = (req, res) => {
    const { title, description, status } = req.body;
    let statusJson = {};

    if (has(status, "resolve") && status.resolve) {
        statusJson = {
            ...statusJson,
            resolve: true,
            resolvedBy: {
                u_id: req.loggedInUser.u_id,
                first_name: req.loggedInUser.first_name,
                last_name: req.loggedInUser.first_name,
                email: req.loggedInUser.email,
            },
        };
    } else {
        statusJson = { resolve: false, resolvedBy: {} };
    }
    tickets
        .create({
            title,
            description,
            status: statusJson,
            owner_id: req.loggedInUser.u_id,
            b_id: req.params.b_id,
        })
        .then((ticket) => {
            res.status(200).json({
                success: true,
                message: `${title} has been created`,
                board: {
                    t_id: ticket.t_id,
                    title,
                    description,
                    status: statusJson,
                    owner: req.loggedInUser.u_id,
                    b_id: req.params.b_id,
                },
            });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};
exports.updateTicket = (req, res) => {
    const { t_id } = req.params;
    const { title, description, status } = req.body;

    if (has(status, "resolve") && status.resolve) {
        statusJson = {
            ...statusJson,
            resolve: true,
            resolvedBy: {
                u_id: req.loggedInUser.u_id,
                first_name: req.loggedInUser.first_name,
                last_name: req.loggedInUser.first_name,
                email: req.loggedInUser.email,
            },
        };
    } else {
        statusJson = { resolve: false, resolvedBy: {} };
    }

    if (!t_id) {
        return res.status(403).json({
            error: true,
            message: `Something went wrong`,
        });
    }
    tickets.findOne({ where: { t_id } }).then((ticket) => {
        if (!ticket) {
            return res.status(403).json({
                error: true,
                message: `Ticket is not available`,
            });
        }

        ticket
            .update({ title, description, status: statusJson })
            .then(() => {
                return res.json({
                    success: true,
                    message: `${title} has been created`,
                    ticket: {
                        t_id: ticket.t_id,
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
    });
};
exports.deleteTicket = (req, res) => {
    const { t_id } = req.params;
    if (!t_id)
        return res.json({
            error: true,
            message: `Something went wrong`,
        });

    tickets
        .findOne({ where: { t_id } })
        .then((ticket) => {
            if (!ticket)
                return res.status(403).json({
                    error: true,
                    message: `Ticket is not available`,
                });

            ticket
                .destroy()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        message: `Ticket has been deleted`,
                    });
                })
                .catch((error) => {
                    return res
                        .status(500)
                        .json({ error: true, message: error.message });
                });
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};
exports.getTicket = (req, res) => {
    const { t_id } = req.params;
    if (!t_id)
        return res.status(403).json({
            error: true,
            message: `Something went wrong`,
        });
    tickets
        .findOne({
            where: { t_id },
            include: [
                {
                    model: users,
                    as: "owner",
                    attributes: ["first_name", "last_name", "u_id", "email"],
                },
            ],
        })
        .then((ticket) => {
            res.status(200).json(ticket);
        })
        .catch((error) => {
            return res
                .status(500)
                .json({ error: true, message: error.message });
        });
};

exports.getTickets = (req, res) => {
    tickets
        .findAll({
            where: { b_id: req.params.b_id },
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
        .then((ticketArray) => {
            let result = [];
            ticketArray.map((ticket) => {
                result = [
                    ...result,
                    ticket /* omit(board.dataValues, ["createdAt"]) */,
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
