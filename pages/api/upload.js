import { uploadOnCloudinary } from "@/utils/cloudinaryUpload";
import { upload } from "@/utils/multer";
import fs from "fs";

export default async function handle(req, res) {
  if (req.method === "POST") {
    try {
      // upload.single("file")
      upload.single("file")(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        console.log(req.file);
        const {secure_url} = await uploadOnCloudinary(req.file.path);
        return res.status(200).json({ success: true, link: secure_url });
      });

      /* let filesURL = [];
      upload.any()(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }

        const { files } = req;
        files.forEach(async (file) => {
          const { secure_url } = await uploadOnCloudinary(file.path);
          // fs.unlinkSync(file.path);
          filesURL.push(secure_url);
          console.log(filesURL);
        });
       
        return res.json({ success: true, links: filesURL });
      }); */
    } catch (error) {
      console.error("Error during file upload:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}

export const config = {
  api: { bodyParser: false },
};
