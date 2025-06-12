import crypto from "crypto";

/**
 * Function Name: generateSecureOTP
 *
 * Description:
 * The function generate a 6 digit otp or increase thier length using crypto.
 *
 * Parameters:
 * - `length:the type is number to defined otp length defualt is 6 digit.
 *
 * Returns:
 * - The return a number.
 * *
 * Example Usage:
 * ```
 *   const response =  generateSecureOTP(6);
 *   console.log(response); // 122545
 * ```
 */
function generateSecureOTP(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
}

export default generateSecureOTP;
