# Movie Explorer API

## Overview

The Movie Explorer API provides endpoints to manage users and their favorite movies. It supports operations such as retrieving user data, adding movies to a user’s favorites, updating movie information, and deleting movies from the list. Additionally, it offers movie recommendations using OpenAI's API based on a selected movie. Designed with scalability and maintainability in mind, this API is built using Node.js, Express, and Sequelize.

---

## API Documentation

The full API documentation is available via Swagger. Access the Swagger UI at:

```
http://localhost:3000/api-docs
```

---

## Features

- Add, update, delete, and retrieve favorite movies for users.
- Get personalized movie recommendations using OpenAI.
- Database interactions using Sequelize with PostgreSQL.
- Input validation with express-validator.
- Centralized error handling and structured logging.

---

## Architecture

### Layered Design
- **Controllers**: Handle HTTP requests and responses.
- **Services**: Contain business logic.
- **Repositories**: Interact with the database.
- **Middlewares**: Validate requests and handle errors.
- **Factories**: Simplify the creation of services and repositories.

### Database Management
- **Sequelize ORM**: Manages models, migrations, and database queries.

### Validation
- **express-validator**: Ensures API inputs are valid and meet required constraints.

### Error Handling
- Centralized middleware for consistent error formatting and status codes.

---

## Technologies Used

- **Node.js with Express**: Backend framework for building RESTful APIs.
- **Sequelize**: ORM for database interactions.
- **PostgreSQL**: Relational database for persistent storage.
- **OpenAI API**: Provides intelligent movie recommendations.
- **express-validator**: Middleware for validating and sanitizing inputs.
- **dotenv**: Loads environment variables.
- **Jest**: Testing framework for unit and integration tests.

---

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL installed and running

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Database Setup

1. Create a PostgreSQL database.
2. Update `.env` file with your database url.
3. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

### Environment Variables

1. Create a `.env` file in the project root.
2. Add the following variables:
   ```plaintext
   PORT=3000
   DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database>
   OPENAI_API_KEY=<your_openai_api_key>
   ```

### Running the Server

1. Start the development server:
   ```bash
   npm start
   ```
2. Access the API at `http://localhost:3000/`.

### Running Tests

Execute the tests with:
```bash
npm test
```
