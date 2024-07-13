/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Users: {
      name: string
      type: "sst.aws.Dynamo"
    }
    UsersAPI: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
  }
}
export {}