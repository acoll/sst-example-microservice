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
    const api = new sst.aws.ApiGatewayV2("UsersAPI");
    api.route("ANY /{proxy+}", {
      handler: "src/routes/index.handler",
    });
  },
});
