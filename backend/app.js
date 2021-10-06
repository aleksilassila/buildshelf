const express = require("express");
const multer = require("multer");
const cors = require("cors");

const config = require("./src/config");
const buildsController = require("./src/controllers/buildsController");
const userController = require("./src/controllers/userController");
const { auth, login } = require("./src/controllers/auth");

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

api.get('/protected', auth, (req, res) => {
    res.send("Authenticated!");
});

api.use('/files', express.static('uploads'));
api.use(express.json());

api.post('/build/create', auth,
    upload.fields([
        { name: "buildFile", maxCount: 1 },
        { name: "images", maxCount: 4 }
    ]), buildsController.create);

api.get('/user/:userId', userController.getUser);

api.get('/builds/new', buildsController.getNewBuilds);
api.get('/builds/top', buildsController.getTopBuilds);
api.get('/builds/search', buildsController.search);

api.get('/build/:buildId', buildsController.getBuild);
api.post('/build/:buildId/favorite', auth, buildsController.favorite);
api.post('/build/:buildId/save', auth, buildsController.save);
api.get('/build/:buildId/download', auth, buildsController.download);

api.post('/login', login);

app.use('/api', api);
sequelize.sync({ force: false }).then(() => {
    console.log("App listening on port 9000");
    app.listen(9000);
});
