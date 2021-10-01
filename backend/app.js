const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const config = require("./src/config");
const buildsLibrary = require("./src/controllers/buildsLibrary");
const { auth, login } = require("./src/controllers/auth");

const { sequelize } = require("./src/database");

const app = express();
const api = express.Router();

sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error: ', err))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.UPLOAD_DIRECTORY);
    },
    filename: (req, file, cb) => {
        const fileExtension = file.originalname.split('.').pop();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension)
    },
});

const upload = multer({ storage });

api.get('/protected', auth, (req, res) => {
    res.send("Authenticated!");
});

api.use('/files', express.static('uploads'));
api.use(express.json());

api.post('/upload', auth,
    upload.fields([
        { name: "buildFile", maxCount: 1 },
        { name: "images", maxCount: 4 }
    ]), buildsLibrary.upload);

api.get('/posts/new', buildsLibrary.getNew);
api.get('/posts/search', buildsLibrary.search);

api.get('/post/:post', buildsLibrary.get);
api.post('/post/:post/favorite', auth, buildsLibrary.favorite);
api.get('/post/:post/download', auth, buildsLibrary.download);

api.post('/login', login);

app.use('/api', api);
sequelize.sync({ force: false }).then(() => {
    app.listen(9000);
})
