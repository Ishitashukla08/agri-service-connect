# Agri Service Connect

A database-driven platform designed to connect farmers with
agricultural workers and service providers.

## Current Status

Working prototype with a browser frontend, Express API, and MySQL database.

## Core Features

- Farmer and land management
- Crop records
- Agricultural service discovery
- Skilled worker management
- Service requests
- Booking management
- Payment tracking
- Reviews and ratings

## Technology

- MySQL
- SQL
- HTML/CSS/JavaScript
- Node.js, Express, and mysql2

## Run locally

1. Import `database/schema.sql`, then `database/sample_data.sql` into MySQL.
2. Confirm the database values in `backend/.env`.
3. In the `backend` folder run `npm start`.
4. Open `frontend/index.html` through VS Code Live Server (or another local web server).

The API health check is `http://localhost:5000/api/health`.

## Demo logins

- Farmer: `9876543210` (Anita Mishra)
- Service provider: `9123456780` (Rakesh Kumar)

This prototype uses contact-number login; it does not implement password authentication.
