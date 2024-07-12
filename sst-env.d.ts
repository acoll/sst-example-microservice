/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Bus: {
      arn: string
      name: string
      type: "sst.aws.Bus"
    }
    UsersAPI: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
  }
}
export {}