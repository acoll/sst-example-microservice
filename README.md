# SST Example Microservice

This project is an example microservice built using the SST framework. It demonstrates various features such as API Gateway, DynamoDB, and EventBridge integration.

## Features

- **API Gateway**: Provides RESTful endpoints for user operations.
- **DynamoDB**: Stores user and event data.
- **EventBridge**: Handles integration events for inter-service communication.
- **Outbox Pattern**: Ensures reliable event publishing by storing events in a DynamoDB table before processing.

## Project Structure

- `src/routes`: Contains the API route handlers.
- `src/domain`: Contains the domain logic and use cases.
- `src/integration-events`: Handles integration events and their publishing.
- `src/database`: Contains the repository for interacting with DynamoDB.

## Running in Development Mode

To run the project in development mode, use the following command:

```bash
npm run dev
```

This will start the SST development environment, allowing you to test and develop the application locally. You can access the Swagger page at `/swagger` to explore the API endpoints.

## Deploying to AWS

To deploy the SST application to AWS, use the following command:

```bash
npm run deploy
```

This will build and deploy the application to your AWS account.
