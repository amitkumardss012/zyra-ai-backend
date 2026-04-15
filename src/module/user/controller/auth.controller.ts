import { Context } from "elysia";
import { IAuthPayload } from "../types/types";
import { ErrorResponse } from "../../../utils/response.utils";
import googleClient from "../../../config/google-client";
import { ENV } from "../../../config/env";
import { prisma } from "../../../config/prisma";
import { generateToken } from "../../../utils/jwt.utils";

export const auth = async ({ body }: Context<{ body: IAuthPayload }>) => {
  const { idToken } = body;

  if (!idToken) {
    throw new ErrorResponse("Invalid token", 400);
  }

  const ticket = await googleClient
    .verifyIdToken({
      idToken,
      audience: ENV.googleClientId,
    })
    .catch((e) => {
      throw new ErrorResponse("Invalid token", 400);
    });

  const payload = ticket.getPayload();

  if (!payload) throw new ErrorResponse("Invalid token", 400);

  const { email, name, email_verified, picture, sub: googleId } = payload;

  if (!email || !name || !email_verified || !picture || !googleId)
    throw new ErrorResponse("Invalid token", 400);

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        isEmailVerified: email_verified,
        avatar: picture,
        googleId,
        provider: "GOOGLE",
      },
    });
  } else {
    user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        name,
        avatar: picture,
        googleId,
      },
    });
  }

  const token = generateToken(user);

  const response = Response.json(
    {
      message: "Login successfullyss",
      data: { token, ...user, id: user.id.toString() },
      success: true,
      statusCode: 200,
      statusText: "OK",
    },
    { status: 200, statusText: "OK" },
  );

  response.headers.set("Authorization", `Bearer ${token}`);
  response.headers.append(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`,
  );

  return response;
};
