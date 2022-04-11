const { Router } = require("express");
const {auth} = require("../controllers/auth");
const clientController = require("../controllers/clientController");
const clientRoutes = Router();

clientRoutes.get("/client/builds", auth, clientController.getBuilds);

module.exports = clientRoutes;