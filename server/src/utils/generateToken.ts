import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload {
  id?: string;
  email?: string;
  otp?:string
}

// generate the twt token
const generateToken = (
  data: JwtPayload,
  expiresIn: SignOptions['expiresIn'] = "1d"
): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = { expiresIn };

  return jwt.sign(data, secret, options);
};

export default generateToken;
