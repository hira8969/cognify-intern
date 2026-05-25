# Cognifyz Task 2 - Advanced Student Registration System

An internship-ready full stack student registration app built with Node.js, Express.js, EJS, HTML5, CSS3, and Vanilla JavaScript.

## Folder Structure

```text
cognify/
|-- server.js
|-- package.json
|-- README.md
|-- src/
|   |-- controllers/
|   |   `-- studentController.js
|   |-- middleware/
|   |   `-- registrationValidator.js
|   |-- models/
|   |   `-- studentModel.js
|   `-- routes/
|       `-- studentRoutes.js
|-- views/
|   |-- index.ejs
|   |-- dashboard.ejs
|   |-- success.ejs
|   |-- 404.ejs
|   `-- partials/
|       |-- head.ejs
|       |-- header.ejs
|       `-- footer.ejs
`-- public/
    |-- css/
    |   `-- style.css
    `-- js/
        |-- main.js
        `-- validation.js
```

## Installation Commands

```bash
npm init -y
npm install express ejs body-parser
```

This project already includes `nodemon` for development. Install all current dependencies with:

```bash
npm install
```

## Run The Server

```bash
npm start
```

Development mode:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## How It Works

`server.js` configures Express, EJS, body parsing, static files, routes, 404 handling, and error handling.

`src/routes/studentRoutes.js` defines the registration, success, dashboard, and delete routes.

`src/controllers/studentController.js` renders pages, stores successful registrations, filters dashboard results, and deletes records.

`src/middleware/registrationValidator.js` performs complete server-side validation for required fields, email, phone, age, password strength, confirm password, terms acceptance, and duplicate email detection.

`src/models/studentModel.js` contains temporary in-memory storage using `const users = [];`. Data resets when the server restarts.

`public/js/validation.js` performs client-side validation on input and submit. It shows inline error messages, red/green field borders, password strength, show/hide password controls, address character count, and form progress.

## Features

- Expanded student registration form
- Client-side and server-side validation
- Duplicate email detection
- Temporary server-side array storage
- Dynamic EJS success page
- Dashboard with registration count, student cards, search, and delete
- Colorful responsive glassmorphism UI
- Smooth hover states, transitions, and page animations
