/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-example-microservice",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const usersTable = new sst.aws.Dynamo("Users", {
      fields: {
        id: "string",
        email: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        EmailIndex: { hashKey: "email" },
      },
    });

    const eventsTable = new sst.aws.Dynamo("Events", {
      fields: { id: "string" },
      primaryIndex: { hashKey: "id" },
      stream: "new-image",
    });

    const api = new sst.aws.ApiGatewayV2("UsersAPI");
    api.route("GET /swagger.json", "src/routes/swagger.handler");
    api.route("GET /swagger", "src/routes/swagger.handler");

    api.route("ANY /{proxy+}", {
      handler: "src/routes/index.handler",
      link: [usersTable, eventsTable],
    });

    const bus = new sst.aws.Bus("Bus");

    eventsTable.subscribe({
      handler: "src/integration-events/publisher.handler",
      link: [bus],
    });

    // wire up fake service as example
    bus.subscribe("src/__some_other_service/fake-email-service.handler", {
      pattern: {
        detailType: [{ prefix: "user." }],
      },
    });
  },
});
