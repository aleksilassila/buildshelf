const express = require("express");
const multer = require("multer");
const cors = require("cors");

const config = require("./src/config");
const buildsController = require("./src/controllers/buildsController");
const userController = require("./src/controllers/userController");
const tagsController = require("./src/controllers/tagsController");
const categoriesController = require("./src/controllers/categoriesController");
const collectionsController = require("./src/controllers/collectionsController");
const { auth, optionalAuth, login } = require("./src/controllers/auth");

const { sequelize } = require("./src/database");

const app = express();
const api = express.Router();

app.use(
    cors({
        origin: '*'
    })
);

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error: ', err))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.' + fileExtension);
    },
});

const upload = multer({ storage });

api.use('/files', express.static('uploads'));
api.use(express.json());

api.post('/build/create', auth,
    upload.fields([
        { name: "buildFile", maxCount: 1 },
        { name: "images", maxCount: 4 }
    ]), buildsController.create);

api.get('/user/:uuid', optionalAuth, userController.getUser);
api.get('/user/:uuid/builds', userController.getUserBuilds);
api.get('/user/:uuid/favorites', userController.getUserFavorites);
api.get('/user/:uuid/saves', auth, userController.getUserSaves);
api.get('/user/:uuid/collections', userController.getUserCollections);

api.get('/builds/get', buildsController.getBuilds);

api.get('/build/:buildId', buildsController.getBuild);
api.post('/build/:buildId/favorite', auth, buildsController.favorite);
api.post('/build/:buildId/save', auth, buildsController.save);
api.get('/build/:buildId/download', auth, buildsController.download);

api.get('/tags', tagsController.getTags);

api.get('/categories', categoriesController.getCategories);

api.get('/collections/find', auth, collectionsController.findCollections);
// api.get('/collections/get', auth, collectionsController.getUserCollections);
api.get('/collections/create', auth, collectionsController.createCollection);
api.delete('/collections/:collectionId/delete', auth, collectionsController.deleteCollection);

api.post('/login', login);

app.use('/api', api);
sequelize.sync({ force: false }).then(() => {
    console.log("App listening on port 9000");
    app.listen(9000);
});
