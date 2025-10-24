BaseCamp - Project Management Backend API

================================================

A modern, secure, and scalable backend for managing projects, tasks, teams, and notes.
Built using Node.js, Express, and MongoDB with authentication, role-based access control, and email verification.

Features

Secure user registration and login with JWT authentication

Access and refresh tokens

Email verification and password reset

Role-based access control (Admin, Project Admin, Member)

Full CRUD operations for projects, tasks, notes, and subtasks

Add, update, and remove project members

Email service with Mailgen and Nodemailer

Input validation using express-validator

Clean API response format and global error handling

CORS and cookie support

Tech Stack

Runtime: Node.js
Framework: Express.js
Database: MongoDB with Mongoose
Authentication: JWT (Access and Refresh Tokens)
Email Service: Mailgen and Nodemailer
Validation: express-validator
Environment: dotenv
Security: bcrypt, cookie-parser, CORS

Folder Structure

basecamp-backend
│
├── controllers - Request handlers for each feature
├── db - MongoDB connection setup
├── middlewares - Auth, validation and role-based middlewares
├── models - Mongoose models (User, Project, Task, Note)
├── routes - API routes for different modules
├── utils - Helper classes (API responses, error handling, async wrapper)
├── validators - Input validators using express-validator
├── app.js - Express app setup
├── server.js - Entry point - starts the server
├── .env - Environment variables
├── package.json
└── README.md

Installation and Setup

Clone the repository
git clone https://github.com/MohammedSameer435/Project-Camp-Backend.git

cd basecamp-backend

Install dependencies
npm install

Create a .env file

PORT=5000
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

MAILTRAP_SMTP_HOST=smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_pass

CORS_ORIGIN=http://localhost:5173

Run the server
npm run dev

The server will start on http://localhost:5000

Make sure MongoDB is running locally or connected via MongoDB Atlas.

API Overview

Auth Routes
Base URL: /api/v1/auth

/register - POST - Register a new user
/login - POST - Login and get tokens
/verify-email/:token - GET - Verify user email
/forgot-password - POST - Send password reset link
/reset-password/:token - POST - Reset password
/logout - POST - Logout user
/current-user - POST - Get current logged-in user
/change-password - POST - Change password

Project Routes
Base URL: /api/v1/projects

/ - GET - Get all projects
/ - POST - Create a new project
/:projectId - GET - Get project by ID
/:projectId - PUT - Update project
/:projectId - DELETE - Delete project
/:projectId/members - GET - Get all project members
/:projectId/members - POST - Add a member
/:projectId/members/:userId - PUT - Update member role
/:projectId/members/:userId - DELETE - Remove member

Task Routes
Base URL: /api/v1/tasks

/:projectId - GET - Get tasks for a project
/:projectId - POST - Create a new task
/:projectId/t/:taskId - GET - Get task by ID
/:projectId/t/:taskId - PUT - Update task
/:projectId/t/:taskId - DELETE - Delete task
/:projectId/t/:taskId/subtasks - POST - Create subtask
/:projectId/st/:subTaskId - PUT - Update subtask
/:projectId/st/:subTaskId - DELETE - Delete subtask

Note Routes
Base URL: /api/v1/notes

/:projectId - GET - Get notes for a project
/:projectId - POST - Create a new note
/:projectId/n/:noteId - GET - Get note by ID
/:projectId/n/:noteId - PUT - Update note
/:projectId/n/:noteId - DELETE - Delete note

Healthcheck
Base URL: /api/v1/healthcheck

GET /api/v1/healthcheck
Response:
{
"success": true,
"data": { "message": "server is running" }
}

Role-Based Access
Admin: Full access to all project actions
Project Admin: Manage tasks, notes, and members
Member: View and update assigned tasks and notes

Email System
The email service uses Mailgen and Nodemailer for:
Sending verification emails
Sending password reset emails
Each email includes a clean HTML template.

API Response Format
Successful response:
{
"success": true,
"statuscode": 200,
"data": {},
"message": "Action completed successfully"
}

Error response:
{
"success": false,
"statuscode": 400,
"message": "Something went wrong",
"errors": []
}


Future Enhancements
File uploads for project assets
Real-time updates with Socket.IO
Dashboard analytics
Calendar integration
