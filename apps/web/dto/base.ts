import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export enum ResponseType {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    VALIDATE_ERROR = "VALIDATE_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
}

export interface ApiOkResponseInterface {
    status: ResponseType;
    statusCode: number;
    message: string;
    data: unknown;
}

export interface ApiErrorResponseInterface {
    status: ResponseType;
    statusCode: number;
    message: string;
    data: unknown;
}

export type ApiValidateErrorDataType = Record<string, string | string[]>;

export type RtkResponseErrorType =
    | FetchBaseQueryError
    | SerializedError
    | {
          status: number;
          data?: {
              statusCode: number;
              status: string;
              message: string;
          };
          originalStatus?: string;
          error?: string;
      };
