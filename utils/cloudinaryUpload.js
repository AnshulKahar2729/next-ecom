import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file on cloudinary
    const uploadedFile = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // remove file from local server once file is uploaded on cloudinary
    fs.unlinkSync(localFilePath); 
    return(uploadedFile);
  } catch (err) {
    console.log(err);
    // remove file from local server because of security reasons
    fs.unlinkSync(localFilePath); 
    return null;
  }
};
