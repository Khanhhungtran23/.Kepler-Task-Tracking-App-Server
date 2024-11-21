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
- **Validation**: Joi for request data validation
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

Link swagger: https://kepler.up.railway.app/api-docs/

6. **Permanent Tokens Account:**
- Description: This provides details about two fixed test accounts (Admin and User) with permanent tokens. Tokens are generated using a script and do not expire.
#### AdminAccount:
```
email: dev@gmail.com
password: 123456
role: admin
permanentToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzJmNTQ4N2Q0ZWExMTczZTg5ZWQxNDAiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MzE3Njc2OTN9.7ZoSP8-vJgvf7bX3PmZaohNfv2JwoSksHdxkMtgOxMc
```
#### UserAccount:
```
email: tester@gmail.com
password: 123456
role: user
permanentToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM4YTdlOGNlNjAzOTIyN2Q5Y2FiYmMiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzMxNzY3NjkzfQ.EqYf8Mw--t-2Lx5Kyrle1a0FQvtf_-NWFrT1FBW7qvA
```

### Guide to use husky
1. Config Husky: npx husky install
2. Tạo Git Hook với Husky : npx husky add .husky/pre-commit "npm test"
3. pre-push: Hook này chạy trước khi bạn push code lên remote repository. Để thêm hook này: npx husky add .husky/pre-push "npm run test"
4. Run command :
```
git add .
git commit -m "Test commit"
```

### VSCode Settings for Jest
Add the following settings to your `.vscode/settings.json`:

```json
{
  "testing.openTesting": "neverOpen",
  "jest.runMode": "on-demand",
  "jest.outputConfig": {
    "revealOn": "run",
    "revealWithFocus": "none",
    "clearOnRun": "none"
  }
}
```
