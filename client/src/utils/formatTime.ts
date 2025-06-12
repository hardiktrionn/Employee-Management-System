/**
 * Function Name: formatTime
 *
 * Description:
 * The function return a time thorw a given date.
 *
 * Parameters:
 * - `dateStr:the date string.
 *
 * Returns:
 * - The return a time-(8:00 PM).
 * - It's return time in string.
 *
 * Example Usage:
 * ```
 *   const response =  formatTime("2024-12-05");
 *   console.log(response); // 8:00PM
 * ```
 */
const formatTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";

  const istDate = new Date(dateStr).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return istDate;
};

export default formatTime;
