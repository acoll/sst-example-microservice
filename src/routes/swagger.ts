import { generateOpenApi } from "@ts-rest/open-api";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { contract } from "./contract";

const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "Posts API",
    version: "1.0.0",
  },
});

export const handler = async (event: APIGatewayProxyEventV2) => {
  if (event.rawPath === "/swagger.json") {
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(openApiDocument),
    };
  }

  const body = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Swagger UI</title>
                <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css">
            </head>
            <body>
                <div id="swagger"></div>
                <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
                <script>
                  SwaggerUIBundle({
                    dom_id: '#swagger',
                    url: '/swagger.json'
                });
                </script>
            </body>
            </html>`;

  return {
    statusCode: 200,
    headers: {
      ["Content-Type"]: "text/html",
    },
    body,
  };
};
