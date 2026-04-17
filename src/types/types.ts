// export { Prisma } from "../../generated/prisma/client";
export * from "../../generated/prisma/client";

export interface ImageType {
  publicId: string;
  url: string;
  [key: string]: any;
}

export const statusCodes = {
  SUCCESS: 200,
  CREATED: 201,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  CONFLICT: 409,
  TO_MANY_REQUESTS: 429,
  
  INTERNAL_SERVER_ERROR: 500,
};
