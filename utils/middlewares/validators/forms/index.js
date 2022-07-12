exports.loginFieldsvalidator = (req, res, next) => {
    const { email, password } = req.body;

    let response = {};

    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(String(email).toLowerCase())) {
        response = {
            ...response,
            error: true,
            email: "Invalid email format",
        };
    }

    if (password == null || password == "") {
        response = {
            ...response,
            error: true,
            password: "Password cannot be empty",
        };
    }

    if (response?.error) {
        return res.status(403).json({ response });
    }
    next();
};
