# Cognifyz Task 3 - Modern Responsive Student Management Frontend

This project upgrades the Task 1 and Task 2 student registration system into a modern Express frontend application using HTML views rendered with the EJS engine.

## Features

- Responsive Bootstrap 5 layout
- Sticky animated navbar with scroll styling
- Landing hero with CTA buttons and an interactive canvas-based 3D student network
- Modern glassmorphism registration form
- Client-side and server-side validation
- Password strength meter and form progress tracker
- Success confirmation page
- Dashboard with stats, search, course filter, card view, and table view
- Button ripples, scroll reveal motion, counters, card shine effects, and 3D tilt interactions
- Modular CSS and JavaScript folder structure

## Folder Structure

```text
public/
  css/
    style.css
    responsive.css
    animations.css
  js/
    main.js
    animations.js
    dashboard.js
    scene3d.js
  assets/
    images/
    icons/
views/
  index.html
  dashboard.html
  success.html
  partials/
    navbar.html
    footer.html
server.js
package.json
```

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:3000` in the browser.

## Notes

Registrations are stored in memory for the current Node.js server session. Restarting the server clears the dashboard data.
