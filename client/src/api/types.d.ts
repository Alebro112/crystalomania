import { ZodErrorsObject } from "./DTO/ZodError";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse =
  | { success: false; type: 'zod'; errors: ZodErrorsObject}
  | { success: false; type: 'message'; message: string }
  | { success: false; type: 'network'; message: string };

export type ApiResult<T> = ApiSuccess<T> | ApiErrorResponse;