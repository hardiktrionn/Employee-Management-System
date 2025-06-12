
/**
 * Function Name: calculateDays
 *
 * Description:
 * The function calculate total number of days between the startDate and endDate.
 *
 * Parameters:
 * - `startData:the type is Date.
 * - `endDate:the type is Date.
 *
 * Returns:
 * - The return a number.
 * *
 * Example Usage:
 * ```
 *   const response =  calculateDays("2025-06-05","2025-06-10");
 *   console.log(response); // 5
 * ```
 */
export const calculateDays = (startDate: Date, endDate: Date) => {
  if (startDate && endDate) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }
  return 0;
};
