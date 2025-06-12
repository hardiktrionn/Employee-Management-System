/**
 * Function Name: formatISODate
 *
 * Description:
 * The function return a formate Data like 11-Jun-2025 thorw a given date.
 *
 * Parameters:
 * - `isoString:the date string.
 *
 * Returns:
 * - The return a time-11-Jun-2025.
 * - It's return time in string.
 *
 * Example Usage:
 * ```
 *   const response =  formatISODate("2024-12-05");
 *   console.log(response); // 11-Jun-2025
 * ```
 */
const formatISODate = (isoString: string | null | undefined): string => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };

  // Format date and replace spaces with hyphens
  return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
};

export default formatISODate;
