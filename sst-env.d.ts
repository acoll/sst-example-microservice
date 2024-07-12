/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    UsersAPI: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
  }
}
export {}