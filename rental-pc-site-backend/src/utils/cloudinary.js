import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFile) => {
  try {
    if (!localFile) {
      return null;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    //upload file on cloudinary;
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
      use_filename: true,
    });
    // file uploaded suceesfully on cloudinary

    // response.then((response)=>{
    //     return response;
    // })
    fs.unlinkSync(localFile);
    return response;
  } catch (error) {
    fs.unlinkSync(localFile); //remove the local file from the temp server
    console.log("in catch,", error);
    return null;
  }
};

const deleteFromCloudinary = async (existingFileId) => {
  try {
    if (!existingFileId) {
      return null;
    }

    console.log(existingFileId);

    const response = await cloudinary.uploader.destroy(existingFileId, {
      resource_type: "image",
    });

    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
