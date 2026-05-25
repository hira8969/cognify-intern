# Secure MERN Student Management System

Production-style Cognifyz Task 6 app with MongoDB, JWT authentication, authorization middleware, secure REST APIs, `.html` EJS views, and a responsive SaaS dashboard.

## Install

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cors morgan ejs express-validator
npm install nodemon --save-dev
```

The dependencies are already declared in `package.json`, so this also works:

```bash
npm install
```

## Environment

Create `.env` from `.env.example` and set:

```bash
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-long-random-secret
CLIENT_URL=http://localhost:3000
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

Students:

- `GET /api/students`
- `GET /api/students/:id`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

## Notes

- Views are saved as `.html` files and rendered with EJS via `app.engine('html', ejs.renderFile)`.
- Student routes are JWT protected.
- Create/update actions allow `admin` and `manager`; delete is restricted to `admin`.
- Render deployment uses `npm start`; MongoDB Atlas credentials belong in environment variables.
