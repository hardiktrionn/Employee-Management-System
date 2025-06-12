import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload {
  id?: string;
  email?: string;
  otp?: string
}

/**
 * Function Name: generateToken
 *
 * Description:
 * The function generate a token using twt.
 *
 * Parameters:
 * - `data:the type is object which data to store in token.
 * - expiresIn:the type is string to set expiresIn time to expire token the default is 1 day.
 *
 * Returns:
 * - The return a token.
 * *
 * Example Usage:
 * ```
 *   const response =  generateToken({id:"123457677"},"5m");
 *   console.log(response); // dgfhghgndgghdhfhbjfghfhfdg
 * ```
 */
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
