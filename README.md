# .Kepler App

## Overview

.Kepler - Task Tracking Management App is designed to help users register, log in, manage their profiles, and track tasks efficiently in each app in your organization. It is built using Node.js, Express.js, MongoDB, and JWT for authentication. The application provides a RESTful API to handle users and task-related actions.

## Features

- **User Authentication:**
  - Register new users.
  - Login users with JWT-based authentication.
  - Logout users and invalidate sessions.
  - Change password for authenticated users.
  - Update profile for authenticated users.

- **Manage projects:**

- **Manage human resources:**

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
   git clone --depth 1 https://github.com/Khanhhungtran23/.Kepler-Task-Tracking-App-Server.git
   cd .Kepler-Task-Tracking-App-Server
   ```
2. **Install dependencies:**
    ```bash
    npm install or npm i
    ```
3. **Set up environment variables:**
  ```bash
  cp .env.example .env

  # open .env and modify the environment variables (if needed)
  ```
  ```bash
  NODE_ENV=development
  PORT=3000
  MONGODB_URI = mongodb+srv://tvkhhung03:3i3S12iiLQD3v6mH@task-management-web-app.nlqtw.mongodb.net/?retryWrites=true&w=majority&appName=Task-management-web-app 
  JWT_SECRET = "in .env file"
  ```
4. **Run the application:**
- Run locally:
  ```bash
  npm run dev
  ```
- Run in production:
  ```bash
  npm run build
  npm run start
  ```
- Commit changes:
  ```bash
  git acpt "message"
  ```
- Testing:
  ```bash
  # Run all tests
  npm run test
  # run TypeScript tests
  npm run test:ts
  # run JS tests
  npm run test:js
  # run all tests in watch mode
  npm run test:watch
  # run test coverage
  npm run coverage
  ```
- Docker:
  ```bash
  # run docker container in development mode
  npm run docker:dev

  # run docker container in production mode
  npm run docker:prod

  # run all tests in a docker container
  npm run docker:test
  ```
- Linting:
  ```bash
  # run ESLint
  npm run lint

  # fix ESLint errors
  npm run lint:fix

  # run prettier
  npm run prettier

  # fix prettier errors
  npm run prettier:fix
  ```
  - The application will start running on http://localhost:3000.

5. **API Endpoints:**

#### Public Routes

- **POST** `api/user/register`: Register a new user
- **POST** `api/user/login`: Login an existing user
- **POST** `api/user/logout`: Logout the user

#### Protected Routes (Requires Authentication)

- **PUT** `api/user/profile`: Update user profile (Authenticated users only)
- **PUT** `api/user/change-password`: Change user password (Authenticated users only)

- **GET** `/api/user/get-all-info` :
- **GET** `/api/user/search/:name` : 

### Error Handling




