import { version } from "../../../package.json";
import { createDocument } from "zod-openapi";
import "zod-openapi/extend";

import { customerPaths, customerSchemas } from "./customer";
import { merchantPaths, merchantSchemas } from "./merchant";
import { commonSchemas, commonResponses } from "./common";

// Define OpenAPI document
const openApiDocument = createDocument({
  openapi: "3.0.0",
  info: {
    title: "Tap-In API Documentation",
    version,
    description: "API documentation for the Tap-In loyalty system",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  components: {
    schemas: {
      ...commonSchemas,
      ...customerSchemas,
      ...merchantSchemas,
    },
    responses: commonResponses,
  },
  paths: {
    ...customerPaths,
    ...merchantPaths,
  },
});

export default openApiDocument;
