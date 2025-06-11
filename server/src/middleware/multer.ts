import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

// multer setup
// upload a profilePhoto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + path.parse(file.originalname).name;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  body: {
    profilePhoto?: string;
    [key: string]: any;
  };
}

const uploadMiddleware = (req: MulterRequest, res: Response, next: NextFunction) => {
  upload.single("profilePhoto")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: 0,
        message: { server: "File upload failed" },
      });
    }

    req.body.profilePhoto = "";

    if (req.file) {
      req.body.profilePhoto = req.file.originalname;
    }

    next();
  });
};

export default uploadMiddleware;
