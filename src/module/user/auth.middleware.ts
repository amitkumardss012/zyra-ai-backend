import { Elysia } from "elysia";
import { prisma } from "../../config/prisma";
import { verifyToken } from "../../utils/jwt.utils";
import { ErrorResponse } from "../../utils/response.utils";

export const isAuthenticated = (app: Elysia) => {
  return app.derive(async ({ cookie: { token }, headers }) => {
    const cookieToken = token.value;
    const authHeader = headers.authorization;
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    const authToken = cookieToken || headerToken;

    if (!authToken || typeof authToken !== "string") {
      throw new ErrorResponse("Unauthorized: No token provided", 401, "UNAUTHORIZED");
    }

    try {
      // Verify token
      const decoded: any = verifyToken(authToken);

      if (!decoded || !decoded.email) {
        throw new ErrorResponse("Unauthorized: Invalid token payload", 401, "UNAUTHORIZED");
      }

      // Check if user exists in the database
      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) {
        throw new ErrorResponse("Unauthorized: User not found", 401, "UNAUTHORIZED");
      }

      // Return user to the context
      return { user };
    } catch (error: any) {
      throw new ErrorResponse(
        `Unauthorized: ${error.message || "Invalid token"}`,
        401,
        "UNAUTHORIZED",
      );
    }
  });
};
