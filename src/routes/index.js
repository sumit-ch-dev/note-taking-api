const { sendResponse } = require("../utils/sendResponse");
const noteRoutes = require("./notes/noteRoute");

const constructorMethod = (app) => {
    app.use('/notes', noteRoutes);

    app.use("*", (req, res) => {
        return sendResponse(res, 404, "Route not found");
    });
};

module.exports = constructorMethod;