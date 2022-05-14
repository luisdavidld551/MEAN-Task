import fs from "fs";
import path from "path";
import moment from "moment";

const saveImagen = async (req) => {
  let imageUrl = "";
  if (Object.keys(req.files).length === 0) {
    imageUrl = "";
  } else {
    if (req.files.image) {
      if (req.files.image.type != null) {
        if (!fs.existsSync("./uploads")) {
          fs.mkdir("./uploads", (error) => {
            if (error) {
              console.log(error.message);
            }
          });
        }
        const url = req.protocol + "://" + req.get("host") + "/";
        const serverImg =
          "./uploads/" + moment().unix() + path.extname(req.files.image.path);
        fs.createReadStream(req.files.image.path).pipe(
          fs.createWriteStream(serverImg)
        );
        imageUrl =
          url +
          "uploads/" +
          moment().unix() +
          path.extname(req.files.image.path);
      }
    }
  }

  return imageUrl;
};

export default { saveImagen };
