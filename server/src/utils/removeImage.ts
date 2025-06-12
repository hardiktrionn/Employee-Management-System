import fs from "fs";
import path from "path";

const imagePath = path.join(__dirname, "../uploads");

/**
 * Function Name: removeImage
 *
 * Description:
 * The function remove image from the uploads derectories.
 *
 * Parameters:
 * - `fileName:the type is file.which file to delete.
 *
 * *
 * Example Usage:
 * ```
 *  removeImage("1749643890763-pexels-souvenirpixels-414612.jpg");
 * ```
 */
const removeImage = (fileName: string): void => {
  const fullPath = path.join(imagePath, fileName);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export default removeImage;
