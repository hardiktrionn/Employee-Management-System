import fs from "fs";
import path from "path";

const imagePath = path.join(__dirname, "../uploads");

// remove image 
const removeImage = (fileName: string): void => {
  const fullPath = path.join(imagePath, fileName);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export default removeImage;
