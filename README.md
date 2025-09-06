# BOLT.URL

A simple, fast, and efficient URL shortener API built with Node.js, Express, and PostgreSQL.

**Live Link:** (https://quick-link-api.vercel.app/)
## Overview

This project is a backend-focused REST API that provides URL shortening services. It exposes two main endpoints:
- `POST /api/shorten`: Takes a long URL and returns a unique, short URL.
- `GET /{shortCode}`: Redirects the user to the original long URL.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (hosted on Neon)
- **Deployment:** Vercel

## Key Concepts Demonstrated
- REST API Design
- SQL Database Schema & Queries
- Asynchronous JavaScript (async/await)
- Environment Variables for Security
