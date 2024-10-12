# Task Tracking Management App

## Overview

This Task Tracking Management App is designed to help users register, log in, manage their profiles, and track tasks efficiently. It is built using Node.js, Express.js, MongoDB, and JWT for authentication. The application provides a RESTful API to handle users and task-related actions.

## Features

- **User Authentication:**
  - Register new users.
  - Login users with JWT-based authentication.
  - Logout users and invalidate sessions.
  - Change password for authenticated users.
  - Update profile for authenticated users.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Middleware**: Express Middleware (Authentication, CORS, Logging)
- **Logging**: Morgan for HTTP request logging
- **Environment Variables**: Managed using Dotenv

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14.x or above)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)

### Steps to Set Up

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/task-tracking-app.git
   cd task-tracking-app
   ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables:**
- Create a .env file at the root of the project with the following content:
  ```bash
  MONGO_DB_USER=tvkhhung03
  MONGO_DB_PASSWORD=3i3S12iiLQD3v6mH
  NODE_ENV=development
  PORT=3000
  MONGODB_URI =  mongodb+srv://tvkhhung03:3i3S12iiLQD3v6mH@task-management-web-app.nlqtw.mongodb.net/?retryWrites=true&w=majority&appName=Task-management-web-app 
  JWT_SECRET = ckIE47slkH

  
4. **Run the application:**
  ```bash
  npm run dev
  ```
  - The application will start running on http://localhost:3000.

5. **API Endpoints:**

### Public Routes

- **POST** `/user/register`: Register a new user
- **POST** `/user/login`: Login an existing user
- **POST** `/user/logout`: Logout the user

### Protected Routes (Requires Authentication)

- **PUT** `/user/profile`: Update user profile (Authenticated users only)
- **PUT** `/user/change-password`: Change user password (Authenticated users only)




