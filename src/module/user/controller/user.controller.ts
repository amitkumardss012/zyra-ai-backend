import { Context } from "elysia";
import { prisma } from "../../../config/prisma";
import { ErrorResponse, SuccessResponse } from "../../../utils/response.utils";
import { ScanningMode, User } from "../../../types/types";

export const getProfile = async ({ user }: { user: User | null }) => {
  if (!user) {
    throw new ErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  SuccessResponse("Profile retrieved successfully", data, 200);
};

export const setPreferredMode = async ({
  body,
  user,
}: Context<{ body: { preferredMode: ScanningMode } }> & { user: User }) => {
  if (!user) {
    throw new ErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      preferredMode: body.preferredMode,
    },
  });

  SuccessResponse(
    "Preferred mode set successfully",
    { user: updatedUser },
    200,
  );
};
