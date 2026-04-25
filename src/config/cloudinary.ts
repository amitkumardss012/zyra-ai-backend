import { v2 as cloudinary } from "cloudinary";
import { getBuffer } from "../utils/utils";
import { ErrorResponse } from "../utils/response.utils";
import { ImageType } from "../types/types";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


export const uploadOnCloudinary = async (image: string, folder: string): Promise<ImageType> => {
  const buffer = await getBuffer(image);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `${process.env.CLOUD_FOLDER}/${folder}`,
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result?.secure_url || !result.public_id)
            return reject(
              new ErrorResponse(
                "Failed to retrieve public_id or URL from Cloudinary response",
                500,
              ),
            );
          else
            resolve({
              publicId: result.public_id,
              url: result.secure_url,
            });
        },
      )
      .end(buffer);
  });
};

export const deleteOnCloudinary = async (publicId: string | undefined | null) => {
  if (!publicId) return;
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== "ok") {
    throw new ErrorResponse(
      "Failed to delete image from Cloudinary",
      500,
      "FAILED_TO_DELETE_IMAGE",
    );
  }
  return result;
};
