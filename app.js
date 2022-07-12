require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const db = require("./models");

/* Middlewares */
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
/* Routes */
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/boards");
const ticketRoutes = require("./routes/ticket");

/* Packages */
const { initSystem } = require("./controllers/init");

/* Greet */
app.get("/", (req, res) => {
    res.json({ TMS: "Hello :)" });
});

/* Initialize system */
app.get("/api/init", initSystem);

/* Routes */
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", boardRoutes);
app.use("/api", ticketRoutes);

/* DB Initialization */
const port = process.env.PORT || 8000;

db.sequelize.sync().then((req) => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
