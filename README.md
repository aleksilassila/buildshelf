# litematica-library

Work-in-progress website for sharing and browsing builds
for a popular block game called Minecraft.

Users can log in with their Minecraft account to upload
and store their builds. NextJS handles frontend, while
express and sequelize handles backend logic together with
PostgreSQL database. Files are stored on filesystem using
Multer.

## Building
The project runs inside Docker. Get started with
`docker-compose up --build`

To seed the database with test data, run
`npm run seed` inside `backend/`

## .env
Create a `.env` file in the root directory of the project.
Docker will use this file to set environment variables.
```
DB_URL=postgres://post:post@db/post
BACKEND_ENDPOINT=http://localhost:9000/api
FRONTEND_ENDPOINT=http://localhost:3000

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
```


## Screenshots
Landing page
![Landing Page](screenshot-1.png?raw=true)

Build card
![Build Card](screenshot-2.png?raw=true)

Build collections page
![Collections](screenshot-3.png?raw=true)

Profile page
![Profile](screenshot-4.png?raw=true)