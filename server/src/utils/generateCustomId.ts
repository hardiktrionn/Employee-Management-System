/**
 * Function Name: generateCustomId
 *
 * Description:
 * The function generate a Unique id.
 *
 *
 * Returns:
 * - The return a string.
 * *
 * Example Usage:
 * ```
 *   const response =  generateCustomId();
 *   console.log(response); // EMP-1234456789
 * ```
 */

const generateCustomId = () => {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  return `EMP-${randomNumber}`;
};

export default generateCustomId;
