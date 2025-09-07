# Contacts API — CSE 341 (Week 01)


A minimal Express + MongoDB API that exposes two endpoints:


- `GET /contacts` — returns all contacts from MongoDB
- `GET /contacts/:id` — returns a single contact by MongoDB ObjectId


## Tech
- Node.js 18+
- Express 4
- MongoDB Node Driver 6


## Local Setup
1. Create `.env` with `MONGODB_URI` and (optionally) `PORT`.
2. Install deps: `npm install`
3. Run dev: `npm run dev`


## Render
- Build Command: `npm install`
- Start Command: `npm start`
- Env var: `MONGODB_URI`
- Health check path: `/`


## Requests
Use the `requests/contacts.rest` file (VS Code REST Client) or Postman.