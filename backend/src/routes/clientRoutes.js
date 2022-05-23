const { Router } = require("express");
const { auth } = require("../controllers/auth");
const clientController = require("../controllers/clientController");
const clientRoutes = Router();

clientRoutes.get("/sync/fetch", auth, clientController.fetchRemote);

module.exports = clientRoutes;
