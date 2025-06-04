const fs = require("fs");
const path = require("path");
const imagePath = path.join(__dirname, "../uploads");

const removeImage = (fileName) => {
  if (fs.existsSync(`${imagePath}/${fileName}`)) {
    fs.unlinkSync(`${imagePath}/${fileName}`);
  }
};

module.exports = removeImage;