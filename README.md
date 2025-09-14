## CSE 341 Contacts API

A RESTful API for managing a contacts list, built with Node.js, Express, and MongoDB. This project was completed as part of the CSE 341 course (Web Backend Development II) at BYU-Idaho.

# Features
CRUD Operations: Create, read, update, and delete contacts

MongoDB Integration: Stores contact data in a MongoDB database

RESTful Design: Follows REST conventions for API endpoints

Swagger Documentation: Interactive API documentation available at /api-docs

Environment Variables: Secure configuration using a .env file

Render Deployment: API is deployed and publicly accessible

# API Endpoints
Method	Endpoint	Description
GET	/contacts	Retrieve all contacts
GET	/contacts/:id	Retrieve a specific contact by ID
POST	/contacts	Create a new contact
PUT	/contacts/:id	Update an existing contact
DELETE	/contacts/:id	Delete a contact

# Contact Schema
Each contact document contains the following fields:

firstName (String, required)

lastName (String, required)

email (String, required)

favoriteColor (String, required)

birthday (Date, required)

# Usage
Once the server is running, you can:

Access the API documentation at http://localhost:3000/api-docs

Use a REST client (like Postman or Thunder Client) to test endpoints

Use the provided .rest file for testing (located in the project root)

# Deployment
This API is deployed on Render and can be accessed at: https://cse341-contacts-8v2y.onrender.com

The interactive Swagger documentation is available at: https://cse341-contacts-8v2y.onrender.com/api-docs

# Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- Swagger UI Express
- Dotenv

# Author
Nuno Silva Ferreira

# License
This project is created for educational purposes as part of the CSE 341 course at BYU-Idaho.