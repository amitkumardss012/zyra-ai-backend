import { Context } from "elysia";
import { prisma } from "../../../config/prisma";
import { User } from "../../../types/types";
import { ErrorResponse, SuccessResponse } from "../../../utils/response.utils";
import { IUpdateProfileRequest } from "../types/user.types";

export const getProfile = async ({ user }: { user: User }) => {
  if (!user) {
    throw new ErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  return SuccessResponse("Profile retrieved successfully", data, 200);
};

export const updateProfile = async ({
  body,
  user,
}: Context<{ body: IUpdateProfileRequest }> & { user: User }) => {
  if(!user){
    throw new ErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
  }

  const data = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...body,
      isProfileCompleted: true,
    },
  });

  return SuccessResponse("Profile updated successfully", data, 200);
};
