import { Context } from "elysia";
import { IAuthPayload } from "../types/user.types";
import { ErrorResponse } from "../../../utils/response.utils";
import { prisma } from "../../../config/prisma";
import { generateToken } from "../../../utils/jwt.utils";

export const auth = async ({ body }: Context<{ body: IAuthPayload }>) => {
  const { name, email, avatar } = body;
  console.log(name, email, avatar)

  if (!email || !name) {
    throw new ErrorResponse("Name and Email are required", 400);
  }

  let user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        avatar,
        isEmailVerified: true,
        provider: "GOOGLE",
      },
    });
  }

  const token = generateToken(user);

  const response = Response.json(
    {
      message: "Login successful",
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
