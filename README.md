# SST Example Microservice

This project is an example microservice built using the SST framework. It demonstrates various features such as API Gateway, DynamoDB, and EventBridge integration.

## Features

- **API Gateway**: Provides RESTful endpoints for user operations.
- **DynamoDB**: Stores user and event data.
- **EventBridge**: Handles integration events for inter-service communication.
- **Outbox Pattern**: Ensures reliable event publishing by storing events in a DynamoDB table before processing.

## Project Structure

- `src/routes`: API route handlers.
- `src/domain`: Domain logic and use cases.
- `src/integration-events`: Handles integration events and their publishing.
- `src/database`: Repository implementation of `UserRepository` for interacting with DynamoDB.
- `src/__some_other_service`: A fake and very primitive/stubbed example of consuming integration events. In a real project this would live in its own package or repo.

## Routes

- `src/routes/index.ts`: Handles the contract routes.
  - `GET /user/:id`: Retrieves a user by ID.
  - `POST /user`: Creates a new user.
  - `PUT /user/:id`: Updates a user by ID.
  - `DELETE /user/:id`: Deletes a user by ID.
- `src/routes/swagger.ts`: Renders the swagger ui.

## Domain

- `src/domain/user.ts`: Defines the `User` schema and invariant logic.
- `src/domain/user.test.ts`: Tests for the `User` schema and invariant logic.
- `src/domain/[operation]`:
  - `[operation].ts`: The functional core of the domain operation.
  - `[operation].controller.ts`: Orchestrates the domain operation use case and performs side effects.
  - `[operation].test.ts`: Tests for the domain operation logic.
  - `[operation].controller.test.ts`: Tests for the domain operation controller.

## Running in Development Mode

To run the project in development mode, use the following command:

```bash
npm run dev
```

This will start the SST development environment, allowing you to test and develop the application locally. You can access the Swagger page at `/swagger` to explore the API endpoints. Learn more about the SST Console [here](https://ion.sst.dev/docs/console/).

## Running the tests

To run the tests in watch mode, use the following command:

```bash
npm run test
```

## Deploying to AWS

To deploy the SST application to AWS, use the following command:

```bash
npm run deploy
```

This will build and deploy the application to your AWS account.
