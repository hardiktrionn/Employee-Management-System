// date are conver into "11-Jun-2025"
const formatISODate = (isoString: string | null | undefined): string => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };

  // Format date and replace spaces with hyphens
  return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
};

export default formatISODate;
