# Buildshelf

Work-in-progress website for sharing and browsing builds
for a popular block game called Minecraft.

Users can log in with their Minecraft account to upload
and store their builds. NextJS handles frontend, while
express and sequelize handles backend logic together with
PostgreSQL database. Files are stored on filesystem using
Multer.

Can be found live at [buildshelf.net](https://buildshelf.net).

## Building
The project runs via Docker. Get started with
`docker-compose up --build`

To seed the database with test data, run
`npm run seed` inside `backend/`

To deploy the website to production, run
`docker-compose -f docker-compose-prod.yml up --build`

## .env
Create a `.env` file in the root directory of the project.
Docker will use this file to set environment variables.
To get Microsoft authentication working, you need to
create an app registration in
[Azure Portal](https://portal.azure.com).
```
DB_URL=postgres://post:post@db/post
BACKEND_ENDPOINT=http://localhost:9000/api
FRONTEND_ENDPOINT=http://localhost:3000
JWT_SECRET=yoursecret

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
```